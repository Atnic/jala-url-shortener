export const fetcher = (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, init).then((response) => {
        if (response.ok) return response.json();
        else throw new Error(response.statusText, { cause: response })
    })
}
