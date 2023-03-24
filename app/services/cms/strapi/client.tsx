import config from "../../config";
import axios from "axios";
import { Locale } from "~/services/cms/models/Locale";

export class Document {
  id: number = 0;
  attributes: any = null;
}

export class Filter {
  field: string = "";
  value: string = "";
}

export enum Parameter {
  nested,
}

export class Request {
  filters?: Filter[];
  parameters?: Parameter[];
  locale?: Locale;
}

export interface IClient {
  getDocument(
    documentCollection: string,
    request: Request
  ): Promise<Document | undefined>;
}

export default class Client implements IClient {
  url: string;
  populate: string = "populate=deep";

  constructor(url?: string) {
    if (url !== undefined) {
      this.url = url;
    } else {
      this.url = config().STRAPI_API;
    }
  }

  getDocument(
    documentCollection: string,
    request: Request
  ): Promise<Document | undefined> {
    const url = this.getUrl(documentCollection, request);
    return axios.get(url, this.getRequestConfig()).then((response) => {
      const data = response.data.data;

      if (Array.isArray(data)) {
        return data.shift() as Document;
      }

      return data as Document;
    });
  }

  private getUrl(documentCollection: string, request: Request): string {
    var url = `${this.url}${documentCollection}?${this.populate}`;

    if (request.filters != undefined) {
      url += request.filters
        .map((filter) => `&filters[${filter.field}][$eq]=${filter.value}`)
        .join("");
    }

    if (request.locale != undefined) {
      url += `&locale=${Locale[request.locale]}`;
    }

    if (request.parameters != undefined) {
      url += `&params=${request.parameters
        .map((param) => Parameter[param])
        .join("&")}`;
    }

    return url;
  }

  private getRequestConfig() {
    return {
      headers: {
        Authorization: "Bearer " + config().STRAPI_ACCESS_KEY,
      },
    };
  }
}

export class RequestBuilder {
  request: Request = new Request();

  addFilter(filter: Filter): RequestBuilder {
    if (this.request.filters === undefined) {
      this.request.filters = [];
    }

    this.request.filters?.push(filter);

    return this;
  }

  setFilter(filter: Filter | Filter[]): RequestBuilder {
    this.request.filters = [];

    if (Array.isArray(filter)) {
      this.request.filters = filter;
    } else {
      this.request.filters?.push(filter);
    }

    return this;
  }

  setParameter(parameters: Parameter[]): RequestBuilder {
    this.request.parameters = parameters;

    return this;
  }

  addParameter(parameter: Parameter): RequestBuilder {
    if (this.request.parameters === undefined) {
      this.request.parameters = [];
    }

    this.request.parameters?.push(parameter);

    return this;
  }

  setLocale(locale: Locale): RequestBuilder {
    this.request.locale = locale;

    return this;
  }

  toRequest(): Request {
    return this.request;
  }
}
