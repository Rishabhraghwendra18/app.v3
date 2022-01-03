import AnimatedLayout from "app/components/layouts/animatedLayout";
import Link from "next/link";
import errorImage from "app/images/404.png";
import Image from "next/image";
import { Button } from "@mui/material";

export default function Custom404() {
  return (
    <AnimatedLayout>
      <div className="p-8 flex flex-col justify-center items-center fadeIn-1 text-xl">
        <Image src={errorImage} alt="404" height={400} width={800} />
        <div className="text-blue-spectbright dark:text-blue-spectlight my-4">
          Oops. You have found that page!
        </div>
        <Link href="/" passHref>
          <Button>Get Back to Spect</Button>
        </Link>
      </div>
    </AnimatedLayout>
  );
}
