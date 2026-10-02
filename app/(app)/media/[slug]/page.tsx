export default async function MediaItemPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    console.log(id);

    return <div>Media ID: {id}</div>;
}

/**
 using slug:


 export default async function MediaItemPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    // get media using slug
}
 */