import TeacherProfile from "@/components/TeacherProfile";

export function generateStaticParams() {
  return [
    { slug: "brent-baum" },
    { slug: "qigong-master" },
    { slug: "elemental-guide" },
  ];
}

export default function TeacherPage({
  params,
}: {
  params: { slug: string };
}) {
  return <TeacherProfile slug={params.slug} />;
}
