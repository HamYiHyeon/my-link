import { DUMMY_LINKS } from "@/data/links"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-svh justify-center bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mt-12 flex w-full max-w-md flex-col gap-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">MyProfile</h1>
          <p className="text-sm text-muted-foreground">MyLink</p>
        </div>

        {DUMMY_LINKS.map((link) => (
          <Link
            href={link.url}
            key={link.id}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Card className="cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
              <CardContent className="flex items-center justify-center p-4">
                <span className="text-lg font-semibold">{link.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
