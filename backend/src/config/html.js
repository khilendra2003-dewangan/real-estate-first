
export const getVerifyEmailHtml = ({ name, email, verifyToken }) => {
  const appName = "Real Estate Pro";
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyUrl = `${baseUrl}/verify/${verifyToken}`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName} - Email Verification</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f6f8fb;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #1a365d 0%, #2d5a87 100%);
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .header p {
        margin: 10px 0 0;
        opacity: 0.9;
      }
      .content {
        padding: 30px;
        color: #333333;
      }
      .content h2 {
        margin-top: 0;
        font-size: 22px;
        color: #1a365d;
      }
      .verify-button {
        display: inline-block;
        background: linear-gradient(135deg, #2d5a87 0%, #1a365d 100%);
        color: white;
        padding: 14px 30px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        margin-top: 20px;
      }
      .footer {
        background-color: #fafafa;
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🏠 ${appName}</h1>
        <p>Your Trusted Real Estate Partner</p>
      </div>
      <div class="content">
        <h2>Hello, ${name || "User"} 👋</h2>
        <p>Thank you for signing up with <strong>${appName}</strong>.</p>
        <p>To complete your registration and verify your email address (<b>${email}</b>), please click the button below:</p>
        <p style="text-align: center;">
          <a href="${verifyUrl}" class="verify-button">Verify Email</a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
        <p>This link will expire in <strong>5 minutes</strong>.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

export const generateHtmlOTP = ({ name, email, otp }) => {
  const appName = "Real Estate Pro";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appName} | OTP Verification</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
          }
          .header {
              background: linear-gradient(135deg, #1a365d 0%, #2d5a87 100%);
              color: #fff;
              text-align: center;
              padding: 24px;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 30px 40px;
              color: #333;
              text-align: left;
          }
          .otp-box {
              background-color: #f4f4f4;
              border: 2px dashed #2d5a87;
              border-radius: 8px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 20px;
              margin: 20px 0;
              color: #1a365d;
          }
          .footer {
              text-align: center;
              padding: 20px;
              background: #fafafa;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🏠 ${appName}</h1>
          </div>
          <div class="content">
              <h2>Hi ${name || "User"},</h2>
              <p>We received a request to verify your email address <strong>${email}</strong>.</p>
              <p>Please use the OTP below to complete your login:</p>

              <div class="otp-box">${otp}</div>

              <p>This OTP will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
              <p>Thank you for choosing <strong>${appName}</strong>!</p>

              <p>— The ${appName} Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

export const getAgentApprovalHtml = ({ name, email }) => {
  const appName = "Real Estate Pro";
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const loginUrl = `${baseUrl}/login`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appName} | Agent Approved</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
          }
          .header {
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: #fff;
              text-align: center;
              padding: 24px;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 30px 40px;
              color: #333;
          }
          .success-icon {
              text-align: center;
              font-size: 60px;
              margin: 20px 0;
          }
          .login-button {
              display: inline-block;
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: white;
              padding: 14px 30px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
          }
          .footer {
              text-align: center;
              padding: 20px;
              background: #fafafa;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🏠 ${appName}</h1>
          </div>
          <div class="content">
              <div class="success-icon">✅</div>
              <h2>Congratulations, ${name}!</h2>
              <p>Your agent account has been <strong>approved</strong>! You can now login to your dashboard and start listing properties.</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${loginUrl}" class="login-button">Login Now</a>
              </p>
              <p>Welcome to the ${appName} family!</p>
              <p>— The ${appName} Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

export const getAgentRejectionHtml = ({ name, reason }) => {
  const appName = "Real Estate Pro";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appName} | Application Status</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
          }
          .header {
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
              color: #fff;
              text-align: center;
              padding: 24px;
          }
          .content {
              padding: 30px 40px;
              color: #333;
          }
          .reason-box {
              background-color: #fef2f2;
              border-left: 4px solid #dc2626;
              padding: 15px;
              margin: 20px 0;
          }
          .footer {
              text-align: center;
              padding: 20px;
              background: #fafafa;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🏠 ${appName}</h1>
          </div>
          <div class="content">
              <h2>Dear ${name},</h2>
              <p>We regret to inform you that your agent application has been <strong>rejected</strong>.</p>
              ${reason ? `
              <div class="reason-box">
                <strong>Reason:</strong><br/>
                ${reason}
              </div>
              ` : ''}
              <p>If you believe this is a mistake or would like to provide additional information, please contact our support team.</p>
              <p>— The ${appName} Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

export const getPropertyApprovalHtml = ({ agentName, propertyTitle }) => {
  const appName = "Real Estate Pro";
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appName} | Property Approved</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
          }
          .header {
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: #fff;
              text-align: center;
              padding: 24px;
          }
          .content {
              padding: 30px 40px;
              color: #333;
          }
          .property-box {
              background-color: #f0fdf4;
              border: 1px solid #059669;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
          }
          .footer {
              text-align: center;
              padding: 20px;
              background: #fafafa;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🏠 ${appName}</h1>
          </div>
          <div class="content">
              <h2>Great News, ${agentName}!</h2>
              <p>Your property listing has been <strong>approved</strong> and is now live on our platform.</p>
              <div class="property-box">
                <strong>Property:</strong> ${propertyTitle}
              </div>
              <p>Potential buyers and renters can now view your listing. Good luck!</p>
              <p>— The ${appName} Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

export const getPropertyRejectionHtml = ({ agentName, propertyTitle, reason }) => {
  const appName = "Real Estate Pro";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appName} | Property Status</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
          }
          .header {
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
              color: #fff;
              text-align: center;
              padding: 24px;
          }
          .content {
              padding: 30px 40px;
              color: #333;
          }
          .property-box {
              background-color: #fef2f2;
              border-left: 4px solid #dc2626;
              padding: 15px;
              margin: 20px 0;
          }
          .footer {
              text-align: center;
              padding: 20px;
              background: #fafafa;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🏠 ${appName}</h1>
          </div>
          <div class="content">
              <h2>Dear ${agentName},</h2>
              <p>Unfortunately, your property listing has been <strong>rejected</strong>.</p>
              <div class="property-box">
                <strong>Property:</strong> ${propertyTitle}<br/><br/>
                ${reason ? `<strong>Reason:</strong> ${reason}` : ''}
              </div>
              <p>Please review and update your listing to meet our guidelines, then resubmit for approval.</p>
              <p>— The ${appName} Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
