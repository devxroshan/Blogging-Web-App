'use client';
import Image from "next/image";
import Link from "next/link";
import Button, {ButtonVariant} from "./components/Button";

export default function Home() {
  return (
    <>
      <main className="px-3 py-6 flex flex-col items-center justify-center w-screen">
        <section className="w-full flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4">
          <div className="w-full h-[35vh] lg:w-[60vw] lg:h-[65vh] relative">
            <Image
              src={"/test-1.jpg"}
              fill={true}
              alt="blog-post-img"
              className="rounded-xl shadow-md object-cover"
            />
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-2 lg:w-[40vw]">
            <span className="font-semibold text-2xl lg:text-4xl">Blog Title</span>
            <span className="text-sm font-medium text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
              incidunt tenetur placeat officiis, aut culpa in id, corrupti at
              rem natus, dolore earum necessitatibus asperiores totam odit
              libero adipisci doloremque!
            </span>
            <Link href={'/'} className="w-full">
              <div className="flex gap-2 items-center justify-start w-full">
                <Image
                  src={"/test.png"}
                  width={35}
                  height={35}
                  alt="Profile Pic"
                  className="rounded-full"
                />

                <div className="flex flex-col">
                  <span className="font-medium text-sm">Roshan Kewat</span>
                  <span className="font-medium text-xs text-gray-600">
                    devxroshan
                  </span>
                </div>
              </div>
            </Link>

            <Button variant={ButtonVariant.BlackPrimary} customStyle="py-3">Read More</Button>
          </div>

        </section>
      </main>
    </>
  );
}
