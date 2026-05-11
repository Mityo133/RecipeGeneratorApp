type Props = {
  params: Promise<{ id: string }>;
};
import Details from '@/app/components/ult/details'
export default async function Page({ params }: Props) {
  const { id } = await params; // ✅ THIS is the fix

  return <>
  <Details id={id} />;
  
  </>
}