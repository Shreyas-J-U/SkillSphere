import nodemailer from "nodemailer";

// Lazy-load transporter to ensure env vars are loaded first
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const isEmailConfigured =
    process.env.EMAIL_USER && !process.env.EMAIL_USER.includes("your.email");

  console.log("📧 Email Configuration (lazy-loaded):");
  console.log("   EMAIL_USER:", process.env.EMAIL_USER);
  console.log("   EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
  console.log("   isEmailConfigured:", isEmailConfigured);

  if (isEmailConfigured) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("   ✅ Transporter created successfully");
  } else {
    console.log("   ⚠️ Email not configured");
  }

  return transporter;
};
// Send email for new barter request
export const sendBarterRequestEmail = async (
  receiverEmail,
  senderName,
  skillOffered,
  skillRequested
) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("⚠️ Email not configured, skipping barter request email");
    return { success: false, error: "Email not configured" };
  }

  const mailOptions = {
    from: `"SkillSphere" <${process.env.EMAIL_USER}>`,
    to: receiverEmail,
    subject: "🎯 New Skill Barter Request on SkillSphere!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #667eea; margin-bottom: 20px;">🎉 You have a new barter request!</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            <strong>${senderName}</strong> wants to exchange skills with you!
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>They offer:</strong> <span style="color: #667eea;">${skillOffered}</span></p>
            <p style="margin: 10px 0;"><strong>They want to learn:</strong> <span style="color: #764ba2;">${skillRequested}</span></p>
          </div>
          <p style="font-size: 14px; color: #666;">
            Log in to SkillSphere to accept or reject this request!
          </p>
          <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            View Request
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Barter request email sent successfully to:", receiverEmail);
    return { success: true };
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("   Error message:", error.message);
    console.error("   Error code:", error.code);
    console.error("   Receiver email:", receiverEmail);

    // Return error details instead of silently failing
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Send email for request status update
export const sendStatusUpdateEmail = async (
  userEmail,
  userName,
  status,
  skillOffered,
  skillRequested
) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("⚠️ Email not configured, skipping status update email");
    return { success: false, error: "Email not configured" };
  }

  const statusMessages = {
    accepted: "✅ Your barter request was accepted!",
    rejected: "❌ Your barter request was declined",
    completed: "🎉 Barter completed successfully!",
  };

  const mailOptions = {
    from: `"SkillSphere" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `SkillSphere: ${statusMessages[status]}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #667eea; margin-bottom: 20px;">${
            statusMessages[status]
          }</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Your barter request status has been updated.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>You offered:</strong> <span style="color: #667eea;">${skillOffered}</span></p>
            <p style="margin: 10px 0;"><strong>You requested:</strong> <span style="color: #764ba2;">${skillRequested}</span></p>
            <p style="margin: 10px 0;"><strong>Status:</strong> <span style="color: ${
              status === "accepted"
                ? "#20c997"
                : status === "rejected"
                ? "#dc3545"
                : "#667eea"
            }; text-transform: uppercase; font-weight: bold;">${status}</span></p>
          </div>
          ${
            status === "accepted"
              ? '<p style="font-size: 14px; color: #666;">You can now start chatting and schedule a learning session!</p>'
              : ""
          }
          <a href="${
            process.env.CLIENT_URL
          }/dashboard" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Status update email sent successfully to:", userEmail);
    return { success: true };
  } catch (error) {
    console.error("❌ Status update email sending failed:");
    console.error("   Error message:", error.message);
    console.error("   Error code:", error.code);
    console.error("   User email:", userEmail);

    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};
