import nodemailer from "nodemailer";

console.log("EMAIL:", process.env.EMAIL);
console.log("PASS exists:", !!process.env.PASS);
console.log("PASS length:", process.env.PASS?.length);

// configuration for nodemailer (email sending service)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("❌ SMTP ERROR:", error);
    } else {
        console.log("✅ SMTP SERVER IS READY");
    }
});

export const sendMail = async ( to: string, subject:string, html:string) => {
    await transporter.sendMail({
        from: `"RideX" <${process.env.EMAIL}>`,
        to,
        subject,
        html
    })
}