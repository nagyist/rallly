"use server";

import { getUser } from "@/data/get-user";
import { type Feedback, feedbackSchema } from "@/features/feedback/schema";
import { getEmailClient } from "@/utils/emails";

import { rateLimit } from "../rate-limit";

export const submitFeedback = async (formData: Feedback) => {
  const { success } = await rateLimit("submitFeedback", 3, "1h");

  if (!success) {
    return {
      error: "Rate limit exceeded" as const,
    };
  }

  const user = await getUser();
  try {
    const { content } = feedbackSchema.parse(formData);
    getEmailClient().sendEmail({
      to: "feedback@rallly.co",
      replyTo: user.email,
      subject: "Feedback",
      text: `User: ${user.name} (${user.email})\n\n${content}`,
    });
    return {
      success: true,
    };
  } catch {
    return {
      error: "Invalid Form Data" as const,
    };
  }
};
