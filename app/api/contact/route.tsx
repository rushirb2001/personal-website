import { NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedFields = contactSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { name, email, message } = validatedFields.data

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Use your verified domain
      to: ["bhavsarrushir@gmail.com"],
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
                background-color: #0a0a0a;
                color: #c8c8c8;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #141414;
                border: 1px solid #333;
                padding: 30px;
              }
              .header {
                border-bottom: 1px solid #333;
                padding-bottom: 15px;
                margin-bottom: 20px;
                font-size: 12px;
                color: #888;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-size: 10px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
              }
              .value {
                font-size: 14px;
                color: #c8c8c8;
                line-height: 1.6;
              }
              .message-content {
                background-color: #0a0a0a;
                border: 1px solid #333;
                padding: 15px;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                NEW MESSAGE RECEIVED FROM PORTFOLIO CONTACT FORM
              </div>
              
              <div class="field">
                <div class="label">FROM</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">EMAIL</div>
                <div class="value">${email}</div>
              </div>
              
              <div class="field">
                <div class="label">MESSAGE</div>
                <div class="message-content">${message}</div>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("Error in contact route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
