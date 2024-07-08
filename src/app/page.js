import Container from './components/Container';

export default function Page({ searchParams }) {
  const currentCatalogPage = parseInt(searchParams.catalogPage);
  const maxCostFilter = parseInt(searchParams.maxCost) || Infinity;
  const estateLocation = searchParams.location;
  const estateName = searchParams.name;

  return (
    <div className='w-[80%]'>
      <Container
        currentPage={currentCatalogPage}
        maxCost={maxCostFilter}
        estateLocation={estateLocation}
        estateName={estateName}
      />
    </div>
  );
}
