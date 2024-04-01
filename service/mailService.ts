import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

const ses = new AWS.SES({ apiVersion: "latest" });

export async function sendEmail({ to, subject, message }: any) {
  const params = {
    Source: process.env.NEXT_PUBLIC_MAIL_SENDER!,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      //   Body: { Text: { Data: message } },
      Body: { Html: { Data: message } },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent:", result.MessageId);
    return result.MessageId;
  } catch (error) {
    console.error("Error while sending email:", error);
    throw error;
  }
}
