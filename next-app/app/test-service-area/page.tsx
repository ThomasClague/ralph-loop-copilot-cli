import {
  ServiceAreaList,
  ServiceAreaMap,
} from "@/src/components/shared/service_area";
import { ServiceAreaContent, BusinessInfo } from "@/src/types/site";

const business: BusinessInfo = {
  name: "Acme Plumbing",
  phone: "555-123-4567",
  email: "info@acmeplumbing.com",
  location: "Chicago",
  industry: "plumbing",
};

const contentWithFewAreas: ServiceAreaContent = {
  headline: "Areas We Serve",
  areas: [
    "Lincoln Park",
    "Logan Square",
    "Wicker Park",
    "Bucktown",
    "River North",
  ],
};

const contentWithManyAreas: ServiceAreaContent = {
  headline: "Our Service Coverage",
  areas: [
    "Lincoln Park",
    "Logan Square",
    "Wicker Park",
    "Bucktown",
    "River North",
    "Gold Coast",
    "Old Town",
    "Lakeview",
    "Andersonville",
    "Edgewater",
    "Rogers Park",
    "Uptown",
  ],
};

const contentWithMap: ServiceAreaContent = {
  headline: "Find Us On The Map",
  areas: ["Downtown", "Northside", "Westside", "Southside"],
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190064.59396163015!2d-88.0161908!3d41.8339042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4cbed%3A0xafe0a6ad09c0c000!2sChicago%2C%20IL!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
};

export default function TestServiceAreaPage() {
  return (
    <div>
      <h1 className="p-6 text-2xl font-bold">Service Area Section Tests</h1>

      <h2 className="px-6 py-2 text-lg font-semibold text-gray-600">
        ServiceAreaList — few areas
      </h2>
      <ServiceAreaList content={contentWithFewAreas} business={business} />

      <hr />

      <h2 className="px-6 py-2 text-lg font-semibold text-gray-600">
        ServiceAreaList — many areas (+ X more badge)
      </h2>
      <ServiceAreaList content={contentWithManyAreas} business={business} />

      <hr />

      <h2 className="px-6 py-2 text-lg font-semibold text-gray-600">
        ServiceAreaMap — with map embed URL
      </h2>
      <ServiceAreaMap content={contentWithMap} business={business} />

      <hr />

      <h2 className="px-6 py-2 text-lg font-semibold text-gray-600">
        ServiceAreaMap — no map URL (falls back to list)
      </h2>
      <ServiceAreaMap content={contentWithFewAreas} business={business} />
    </div>
  );
}
