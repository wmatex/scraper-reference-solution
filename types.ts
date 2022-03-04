export interface Result {
    code: string;
    name: string;
    image: string;
    price: number;
    inStock: string | null;
    rating: number | null;
}

export interface SearchResult {
    search: string;
    numResults: number;
    bestSelling: Array<Result>;
    mostExpensive: Array<Result>;
    bestRated: Array<Result>;
}
