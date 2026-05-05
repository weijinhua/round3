import IORedis from 'ioredis';
import nodemailer from 'nodemailer';

const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

async function processJob(raw: string) {
  let job;
  try {
    job = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid job payload', e);
    return;
  }

  const transporter = nodemailer.createTransport(process.env.MAILER_URL || '');

  const msg = {
    from: process.env.MAILER_FROM,
    to: job.email,
    subject: job.subject || 'Notification',
    html: job.html || '<p></p>',
  };

  try {
    await transporter.sendMail(msg);
    console.log('Email sent', job);
  } catch (err) {
    console.error('Email send failed', err);
    // push to mail:failed list for inspection
    await redis.rpush('mail:failed', raw);
  }
}

async function run() {
  console.log('Worker started, listening for mail jobs...');
  while (true) {
    try {
      const res = await redis.blpop('mail:queue', 0);
      if (!res) continue;
      const [, payload] = res;
      await processJob(payload);
    } catch (err) {
      console.error('Worker loop error', err);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

run().catch((err) => {
  console.error('Worker failed to start', err);
  process.exit(1);
});

