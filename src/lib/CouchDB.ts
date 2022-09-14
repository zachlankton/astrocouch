import Log, { LogLevel } from "./Logger";

interface dbUrlOptsIF {
  scheme?: string;
  domain?: string;
  port?: string;
  dbName?: string;
  user?: string;
  pass?: string;
}

interface authHeaderIF {
  Authorization: string;
}

interface docIF {
  _id: string;
  [key: string]: any;
}

class CouchDB {
  #urlOpts: dbUrlOptsIF;
  #baseUrl: string;
  #dbUrl: string;
  #authHeader: authHeaderIF;

  constructor(options?: dbUrlOptsIF) {
    this.#urlOpts = this.#getDbUrlOpts(options);
    this.#baseUrl = this.#getBaseUrl(this.#urlOpts);
    this.#dbUrl = this.#getDbUrl(this.#urlOpts);
    this.#authHeader = this.#getAuthHeader(this.#urlOpts);
    this.#createDatabase();
  }

  #getDbUrlOpts(options?: dbUrlOptsIF): dbUrlOptsIF {
    // get defaults from environment
    const _scheme = import.meta.env.DB_SSL === "true" ? "https" : "http";
    const _dbDomain = import.meta.env.DB_DOMAIN;
    const _dbPort = import.meta.env.DB_PORT
      ? ":" + import.meta.env.DB_PORT
      : "";
    const _dbName = import.meta.env.DB_NAME;
    const _dbUser = import.meta.env.DB_USER;
    const _dbPass = import.meta.env.DB_PASS;

    if (!options?.user && !_dbUser)
      throw "dbUrlOpts requires a 'user' property to be set either explicity or from the environment as DB_USER";

    if (!options?.pass && !_dbPass)
      throw "dbUrlOpts requires a 'pass' property to be set either explicity or from the environment as DB_PASS";

    if (!options?.dbName && !_dbName)
      throw "dbUrlOpts requires a 'dbName' property to be set either explicity or from the environment as DB_NAME";

    const dbUrlOpts: dbUrlOptsIF = {
      scheme: options?.scheme || _scheme || "http",
      domain: options?.domain || _dbDomain || "localhost",
      port: options?.port || _dbPort || "5984",
      dbName: options?.dbName || _dbName,
      user: options?.user || _dbUser,
      pass: options?.pass || _dbPass,
    };

    return dbUrlOpts;
  }

  #getBaseUrl(options?: dbUrlOptsIF): string {
    const baseUrl = `${options.scheme}://${options.domain}${options.port}`;
    return baseUrl;
  }

  #getDbUrl(options?: dbUrlOptsIF | string): string {
    if (typeof options === "string") return options;
    const dbUrl = `${this.#getBaseUrl(options)}/${options.dbName}`;
    return dbUrl;
  }

  #getAuthHeader(options: dbUrlOptsIF): authHeaderIF {
    const authHeader: authHeaderIF = {
      Authorization: `Basic ${btoa(options.user + ":" + options.pass)}`,
    };
    return authHeader;
  }

  async #createDatabase() {
    Log(
      { msg: "Creating Database if not exists.", dbUrl: this.#dbUrl },
      LogLevel.INFO
    );

    const resp = await fetch(this.#dbUrl, {
      method: "PUT",
      headers: new Headers({
        ...this.#authHeader,
      }),
    });
    const data = await resp.json();
    return data;
  }

  async getCouchDbInfo() {
    Log(
      { msg: "Getting Couch Installation Info.", baseUrl: this.#baseUrl },
      LogLevel.INFO
    );
    const resp = await fetch(this.#baseUrl, {
      headers: new Headers({
        ...this.#authHeader,
      }),
    });
    const data = await resp.json();
    return data;
  }

  async getDbInfo() {
    Log({ msg: "Getting DB Info.", dbUrl: this.#dbUrl }, LogLevel.INFO);

    const resp = await fetch(this.#dbUrl, {
      headers: new Headers({
        ...this.#authHeader,
      }),
    });

    Log({ msg: "getDbInfo Response", resp }, LogLevel.DEBUG);

    const data = await resp.json();
    return data;
  }

  /**
   * Get all the documents in the database
   * @returns - an array of documents
   */
  async allDocs() {
    Log({ msg: "Getting All Docs.", dbUrl: this.#dbUrl }, LogLevel.INFO);

    const resp = await fetch(this.#dbUrl + "/_all_docs?include_docs=true", {
      headers: new Headers({
        ...this.#authHeader,
      }),
    });

    Log({ msg: "allDocs Response", resp }, LogLevel.DEBUG);

    const data = await resp.json();
    return data.rows.map((row) => row.doc);
  }

  /**
   * Get a single document from the database
   * @param id - the id of the document to retrieve
   * @returns - the document object
   */
  async getDoc(id: string) {
    Log({ msg: "Get Doc.", id }, LogLevel.INFO);

    const resp = await fetch(this.#dbUrl + "/" + id, {
      headers: new Headers({
        ...this.#authHeader,
      }),
    });

    Log({ msg: "Get Doc Response", resp }, LogLevel.DEBUG);

    const data = await resp.json();
    return data;
  }

  /**
   * Upsert a Document into the Database, if the document
   * with the same id exists, it will be replaced
   *
   * @param doc
   * > A Document Object. ie:
   * > ```json
   * > {
   * >   _id: "aUniqueId",
   * >   ...otherData
   * > }
   * > ```
   *
   * @returns a response object
   */
  async upsertDoc(doc) {
    Log({ msg: "PUT Doc.", dbUrl: this.#dbUrl }, LogLevel.INFO);
    Log({ msg: "Doc", doc }, LogLevel.DEBUG);

    if (!doc._id) throw "Doc needs an _id property";

    const existingDoc = await this.getDoc(doc._id);
    if (!existingDoc.error) doc._rev = existingDoc._rev;

    const resp = await fetch(this.#dbUrl, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        ...this.#authHeader,
      }),
      body: JSON.stringify(doc),
    });

    Log({ msg: "upsertDoc Response", resp }, LogLevel.DEBUG);

    const data = await resp.json();
    return data;
  }
}

export default CouchDB;
