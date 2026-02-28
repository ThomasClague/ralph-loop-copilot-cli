"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Save } from "lucide-react";

const INDUSTRIES = [
  "roofing",
  "plumbing",
  "electrical",
  "landscaping",
  "cleaning",
  "painting",
  "construction",
  "hvac",
  "pest_control",
  "locksmith",
];

interface SettingsForm {
  anthropic_api_key: string;
  pexels_api_key: string;
  resend_api_key: string;
  email_mode: string;
  from_email: string;
  reply_to: string;
  default_industry: string;
  default_section_count: string;
}

const DEFAULT_FORM: SettingsForm = {
  anthropic_api_key: "",
  pexels_api_key: "",
  resend_api_key: "",
  email_mode: "mock",
  from_email: "",
  reply_to: "",
  default_industry: "roofing",
  default_section_count: "8",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(DEFAULT_FORM);
  const [showKeys, setShowKeys] = useState({
    anthropic_api_key: false,
    pexels_api_key: false,
    resend_api_key: false,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setForm((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {
        showToast("error", "Failed to load settings");
      });
  }, []);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function set(key: keyof SettingsForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleShowKey(key: keyof typeof showKeys) {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Settings saved successfully");
    } catch {
      showToast("error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`rounded-md px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Keys are stored in the database, not in environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              { key: "anthropic_api_key", label: "Anthropic API Key" },
              { key: "pexels_api_key", label: "Pexels API Key" },
              { key: "resend_api_key", label: "Resend API Key" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key}>{label}</Label>
              <div className="relative">
                <Input
                  id={key}
                  type={showKeys[key] ? "text" : "password"}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={`Enter ${label}`}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey(key)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label={showKeys[key] ? "Hide key" : "Show key"}
                >
                  {showKeys[key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>Configure outreach email settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-mode-switch">Email Mode</Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                {form.email_mode === "live"
                  ? "Live (sends real emails)"
                  : "Mock (no emails sent)"}
              </p>
            </div>
            <Switch
              id="email-mode-switch"
              checked={form.email_mode === "live"}
              onCheckedChange={(checked) =>
                set("email_mode", checked ? "live" : "mock")
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="from_email">From Email</Label>
            <Input
              id="from_email"
              type="email"
              value={form.from_email}
              onChange={(e) => set("from_email", e.target.value)}
              placeholder="hello@yourdomain.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reply_to">Reply-To Email</Label>
            <Input
              id="reply_to"
              type="email"
              value={form.reply_to}
              onChange={(e) => set("reply_to", e.target.value)}
              placeholder="replies@yourdomain.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generation Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Defaults</CardTitle>
          <CardDescription>
            Default values used when starting a new generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="default_industry">Default Industry</Label>
            <Select
              value={form.default_industry}
              onValueChange={(v) => set("default_industry", v)}
            >
              <SelectTrigger id="default_industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="default_section_count">
              Default Section Count (7–10)
            </Label>
            <Input
              id="default_section_count"
              type="number"
              min={7}
              max={10}
              value={form.default_section_count}
              onChange={(e) => set("default_section_count", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
