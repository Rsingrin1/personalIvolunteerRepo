export const generateWelcomeEmail = (username, email) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to iVolunteer</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #1f49b6 0%, #2c5aa0 100%);
                color: #ffffff;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: -0.5px;
            }
            .header p {
                margin: 10px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px;
                color: #333333;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #1f49b6;
                font-weight: 600;
            }
            .message {
                font-size: 16px;
                line-height: 1.6;
                color: #555555;
                margin-bottom: 30px;
            }
            .message p {
                margin: 0 0 15px 0;
            }
            .highlight {
                color: #1f49b6;
                font-weight: 600;
            }
            .cta-button {
                display: inline-block;
                background-color: #1f49b6;
                color: #ffffff !important;
                text-decoration: none;
                padding: 12px 30px;
                border-radius: 5px;
                font-weight: 600;
                margin: 20px 0;
                transition: background-color 0.3s ease;
                opacity: 1;
            }
            .cta-button:hover {
                background-color: #2c5aa0;
            }
            .footer {
                background-color: #f9f9f9;
                border-top: 1px solid #e0e0e0;
                padding: 20px;
                text-align: center;
                color: #999999;
                font-size: 12px;
            }
            .footer p {
                margin: 5px 0;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, #1f49b6, transparent);
                margin: 30px 0;
            }
            .features {
                background-color: #f0f4f8;
                padding: 20px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .features ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .features li {
                padding: 8px 0;
                color: #333333;
                font-size: 15px;
            }
            .features li:before {
                content: "✓ ";
                color: #1f49b6;
                font-weight: bold;
                margin-right: 8px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <h1>Welcome to iVolunteer</h1>
                <p>Your Journey to Making a Difference Starts Here</p>
            </div>

            <!-- Content -->
            <div class="content">
                <div class="greeting">Hello, ${username}! 👋</div>
                
                <div class="message">
                    <p>Thank you for registering with <span class="highlight">iVolunteer</span>! We're thrilled to have you join our community of passionate volunteers.</p>
                    
                    <p>Your account has been successfully created and is ready to use. You can now:</p>
                </div>

                <!-- Features -->
                <div class="features">
                    <ul>
                        <li>Browse and discover volunteer opportunities in your community</li>
                        <li>Connect with organizations making a real impact</li>
                        <li>Track your volunteer activities and contributions</li>
                        <li>Build your volunteer portfolio and experience</li>
                        <li>Make a meaningful difference in people's lives</li>
                    </ul>
                </div>

                <div class="message">
                    <p>To get started, you can log in to your account using your email address and password.</p>
                </div>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/login" class="cta-button">Log In to Your Account</a>
                </div>

                <div class="divider"></div>

                <div class="message">
                    <p><strong>Need Help?</strong></p>
                    <p>If you have any questions or need assistance, our support team is here to help. Feel free to reach out to us at support@ivolunteer.org or reply to this email.</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2025 iVolunteer. All rights reserved.</p>
                <p>You're receiving this email because you created an account with iVolunteer.</p>
                <p>
                    <a href="http://localhost:5173" style="color: #1f49b6; text-decoration: none;">Visit Our Website</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const generatePasswordResetEmail = (username, resetUrl) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
                <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin:0; padding:0 }
                        .container { max-width:600px; margin:20px auto; background:#fff; border-radius:8px; overflow:hidden; }
                        .header { background: linear-gradient(135deg, #1f49b6 0%, #2c5aa0 100%); color:#fff; padding:30px 20px; text-align:center }
                        .content { padding:30px; color:#333 }
                        .cta { display:inline-block; background:#1f49b6; color:#fff !important; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600 }
                        .footer { padding:16px; text-align:center; font-size:12px; color:#888 }
                </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello ${username || ''},</p>
                    <p>We received a request to reset your password. If you made this request, click the button below to choose a new password. This link will expire in one hour.</p>
                    <p style="text-align:center;margin:24px 0;"><a class="cta" href="${resetUrl}">Reset your password</a></p>
                    <p>If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 iVolunteer. If you need help, reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
