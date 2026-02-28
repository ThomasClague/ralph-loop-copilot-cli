import VideoEmbed from "@/src/components/shared/video/VideoEmbed";
import { VideoContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "Demo Co",
  phone: "555-1234",
  email: "demo@demo.com",
  location: "Denver, CO",
  industry: "plumbing",
};

const content: VideoContent = {
  headline: "Watch How We Work",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

export default function TestVideoPage() {
  return (
    <div style={{ "--color-bg": "#fff", "--color-heading": "#111" } as React.CSSProperties}>
      <VideoEmbed content={content} business={business} />
    </div>
  );
}
