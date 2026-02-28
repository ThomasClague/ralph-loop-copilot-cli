import { TeamContent, BusinessInfo } from "@/src/types/site";

interface TeamCardsProps {
  content: TeamContent;
  business: BusinessInfo;
}

/**
 * Returns initials (up to 2 chars) from a full name.
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * TeamCards — grid of team member cards with circular avatar, name, role, and optional bio.
 * Falls back to initials avatar when no photo URL is provided.
 */
export function TeamCards({ content }: TeamCardsProps) {
  return (
    <section
      className="w-full py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="mb-12 text-center text-3xl font-bold"
          style={{ color: "var(--color-heading)" }}
        >
          {content.headline || "Meet Our Team"}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {content.members.map((member, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center rounded-2xl p-6 text-center"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Avatar */}
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="mb-4 h-20 w-20 rounded-full object-cover"
                  style={{ border: "2px solid var(--color-border)" }}
                />
              ) : (
                <div
                  className="mb-4 flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-inverted)",
                  }}
                >
                  {getInitials(member.name)}
                </div>
              )}

              <h3
                className="mb-1 text-lg font-bold"
                style={{ color: "var(--color-heading)" }}
              >
                {member.name}
              </h3>

              <p
                className="mb-3 text-sm font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                {member.role}
              </p>

              {member.bio && (
                <p
                  className="line-clamp-3 text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
