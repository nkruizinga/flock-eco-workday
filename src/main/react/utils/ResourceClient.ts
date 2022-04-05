import { addError } from "../hooks/ErrorHook";



export function ExtractJSON<A>(res: Response):Promise<A | null> {
  if (res.ok) {
    if (res.status === 204) {
      return Promise.resolve(null);
    }
    return res.json();
  }
  return res.text().then((message) => {
    throw new Error(message);
  });
}

export function ResourceClient<ID, T>(
  path: string,
  internalize?: (input: T) => T
) {
  const all: () => Promise<T[] | void> = () => {
    const opts = {
      method: "GET",
    };
    return fetch(`${path}`, opts)
      .then(it => ExtractJSON<T[]>(it))
      .then((it) => it != null ? (internalize ? it.map(internalize) : it) : [])
      .catch((e) => addError(e.message));
  };

  const get: (id: ID) => Promise<T | null | void> = (id) => {
    debugger;
    const opts = {
      method: "GET",
    };
    return fetch(`${path}/${id}`, opts)
      .then(it => ExtractJSON<T>(it))
      .then((it) => it != null ? (internalize ? internalize(it) : it) : null)
      .catch((e) => addError(e.message));
  };

  const post: (item: T) => Promise<T | null | void> = (item) => {
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    };
    return fetch(path, opts)
      .then(it => ExtractJSON<T>(it))
      .then((it) => it != null ? (internalize ? internalize(it) : it) : null)
      .catch((e) => addError(e.message));
  };

  const put: (id: ID, item: T) => Promise<T | null | void> = (id, item) => {
    const opts = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    };
    return fetch(`${path}/${id}`, opts)
      .then(it => ExtractJSON<T>(it))
      .then((it) => it != null ? (internalize ? internalize(it) : it): null)
      .catch((e) => addError(e.message));
  };

  const del: (id: ID) => Promise<void | null> = (id) => {
    const opts = {
      method: "DELETE",
    };
    return fetch(`${path}/${id}`, opts)
      .then(it => ExtractJSON<void>(it))
      .catch((e) => addError(e.message));
  };

  return { all, get, post, put, delete: del };
}
