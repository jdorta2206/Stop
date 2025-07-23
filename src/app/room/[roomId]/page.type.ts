export type PageProps = {
    params: { roomId: string };
    searchParams?: { [key: string]: string | string[] | undefined };
};