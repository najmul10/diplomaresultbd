"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Send, Loader2, MapPin, MessageSquare, Clock } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type FeedbackPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

async function sendFeedback(payload: FeedbackPayload) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to send message");
  }
  return json.data;
}

const SUBJECTS = [
  "General Feedback",
  "Bug Report",
  "Feature Request",
  "Data Correction",
  "Partnership Inquiry",
  "Other",
];

export function ContactView() {
  const [form, setForm] = React.useState<FeedbackPayload>({
    name: "",
    email: "",
    subject: "General Feedback",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: sendFeedback,
    onSuccess: (data) => {
      toast.success(data.message || "Message sent successfully!");
      setForm({ name: "", email: "", subject: "General Feedback", message: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Contact Us"
        description="Questions, feedback, or bug reports? We'd love to hear from you."
        icon={Mail}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what's on your mind... (min 10 characters)"
                  className="min-h-32"
                  required
                  minLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  {form.message.length}/10 characters minimum
                </p>
              </div>
              <Button
                type="submit"
                className="w-full gap-2 sm:w-auto"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {mutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">support@btebresultszone.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Telegram</p>
                  <p className="text-sm text-muted-foreground">@btebresultszone</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  <p className="text-sm text-muted-foreground">Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Response Time</p>
                  <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-5 text-center">
              <p className="text-sm font-semibold">Join our community</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Get instant result notifications and updates on our Telegram channel.
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5">
                <Send className="h-4 w-4" />
                Join Telegram
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
