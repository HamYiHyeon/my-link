import { Metadata } from "next";

type Props = {
  params: Promise<{ username: string }>;
};

async function fetchUserByQuery(field: string, value: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "users" }],
            where: {
              fieldFilter: {
                field: { fieldPath: field },
                op: "EQUAL",
                value: { stringValue: value },
              },
            },
            limit: 1,
          },
        }),
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0 && data[0].document) {
        return data[0].document.fields;
      }
    }
  } catch (error) {
    console.error("Firestore REST API Error:", error);
  }
  return null;
}

async function fetchUserById(id: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${id}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.fields) {
        return data.fields;
      }
    }
  } catch (error) {
    console.error("Firestore REST API Error:", error);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedName = decodeURIComponent(resolvedParams.username);

  let userFields = await fetchUserByQuery("displayName", decodedName);
  
  if (!userFields) {
    userFields = await fetchUserByQuery("username", decodedName);
  }
  
  if (!userFields) {
    userFields = await fetchUserById(decodedName);
  }

  if (userFields) {
    const displayName = userFields.displayName?.stringValue || decodedName;
    const usernameField = userFields.username?.stringValue || decodedName;
    const description = userFields.description?.stringValue || `${displayName}님의 링크 프로필입니다. 다양한 소셜 링크를 확인해보세요.`;

    return {
      title: `${displayName} (@${usernameField})`,
      description: description,
      openGraph: {
        title: `${displayName} (@${usernameField}) | MyLink`,
        description: description,
      },
      twitter: {
        card: "summary_large_image",
        title: `${displayName} (@${usernameField}) | MyLink`,
        description: description,
      },
    };
  }

  return {
    title: `${decodedName}의 프로필`,
    description: `${decodedName}님의 MyLink 프로필입니다.`,
  };
}

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
