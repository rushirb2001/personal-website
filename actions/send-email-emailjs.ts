"use server"

import { z } from "zod"

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

// Define the form state type
export type FormState = {
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
    _form?: string[]
  }
  success?: boolean
}

// Server action to send email with EmailJS
export async function sendEmailWithEmailJS(prevState: FormState, formData: FormData): Promise<FormState> {
  console.log("Starting email submission process")

  // Validate form data
  const validatedFields = formSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error.flatten())
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, message } = validatedFields.data
  console.log("Validated data:", { name, email, message })

  try {
    // In a server action, we can't directly use the EmailJS browser SDK
    // Instead, we'll use the EmailJS REST API
    console.log("Sending request to EmailJS API")

    const payload = {
      service_id: "service_akeeivv",
      template_id: "template_cyytr4f",
      user_id: "vCNvTU_mqabgUgPcO",
      template_params: {
        from_name: name,
        from_email: email,
        message: message,
        to_name: "Rushir Bhavsar", // Add recipient name
        reply_to: email, // Ensure reply-to is set
      },
    }

    console.log("Request payload:", payload)

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    console.log("EmailJS response status:", response.status)

    // Get the response text for better debugging
    const responseText = await response.text()
    console.log("EmailJS response text:", responseText)

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.status} ${responseText}`)
    }

    console.log("Email sent successfully")

    // Return success state
    return {
      errors: {},
      success: true,
    }
  } catch (error) {
    // Log the detailed error
    console.error("Error sending email:", error)

    // Return error state
    return {
      errors: {
        _form: ["Failed to send email. Please try again later."],
      },
    }
  }
}
