import { ImageCarousel } from './ImageCarousel';
import { CommunitySectionIntro } from './CommunitySectionIntro';

const galleryImages = [
  {
    src: '/events/event_images/IMG_4191.png',
    alt: 'ETHShala speaker presenting to a campus audience',
    title: 'HETC · Offline Session',
  },
  {
    src: '/events/event_images/InnovoCon2_1.jpeg',
    alt: 'Students working together at InnovoCon Hacknex',
    title: 'InnovoCon Hacknex 2.0 · Hackathon',
  },
  {
    src: '/events/event_images/IMG_6610.jpeg',
    alt: 'Students connecting after an ETHShala session',
    title: 'MCKVIE · Offline Session',
  },
  {
    src: '/events/event_images/IMG_4217.png',
    alt: 'Students connecting after an ETHShala session',
    title: 'HETC · Offline Session',
  },
  {
    src: '/events/event_images/IMG_6598.jpeg',
    alt: 'Students connecting after an ETHShala session',
    title: 'MCKVIE · Offline Session',
  },
];

export function CommunityGallerySection() {
  return (
    <section id="gallery" className="overflow-hidden bg-[#061a16] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:px-10 lg:py-16">
        <CommunitySectionIntro
          eyebrow="Event gallery"
          title={<>Moments<br /><span className="text-emerald-300">that matter.</span></>}
          description="Snapshots from our events, workshops, bootcamps, and campus sessions."
          href="#gallery-images"
          action="View the gallery"
          dark
        />

        <div id="gallery-images">
          <ImageCarousel
            images={galleryImages.map((image) => ({
              ...image,
              eyebrow: 'Event gallery',
            }))}
          />
        </div>
      </div>
    </section>
  );
}
