import { GalleryGrid, GalleryMasonry } from "@/src/components/shared/gallery";
import { GalleryContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "Acme Plumbing",
  phone: "555-1234",
  email: "info@acmeplumbing.com",
  location: "Springfield",
  industry: "plumbing",
};

const content: GalleryContent = {
  headline: "Our Recent Work",
  images: [
    {
      url: "https://placehold.co/400x600?text=Project+1",
      alt: "Bathroom renovation",
      caption: "Full bathroom renovation",
    },
    {
      url: "https://placehold.co/400x300?text=Project+2",
      alt: "Kitchen pipes",
      caption: "Kitchen pipe replacement",
    },
    {
      url: "https://placehold.co/400x500?text=Project+3",
      alt: "Water heater",
    },
    {
      url: "https://placehold.co/400x350?text=Project+4",
      alt: "Drain repair",
      caption: "Emergency drain repair",
    },
    {
      url: "https://placehold.co/400x450?text=Project+5",
      alt: "Outdoor plumbing",
    },
    {
      url: "https://placehold.co/400x400?text=Project+6",
      alt: "Toilet installation",
      caption: "Toilet installation",
    },
  ],
};

export default function TestGalleryPage() {
  return (
    <main>
      <div className="bg-gray-100 p-4 text-center font-bold">
        Gallery Grid Variant
      </div>
      <GalleryGrid content={content} business={business} />

      <div className="bg-gray-100 p-4 text-center font-bold">
        Gallery Masonry Variant
      </div>
      <GalleryMasonry content={content} business={business} />
    </main>
  );
}
