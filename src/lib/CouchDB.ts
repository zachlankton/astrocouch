import Logger, { LogLevel } from "./Logger";

interface dbUrlOptsIF {
  scheme?: string;
  domain?: string;
  port?: string;
  dbName?: string;
  user?: string;
  pass?: string;
  logLevelEnv?: string;
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
  #user: string;
  #pass: string;
  #scheme: string;
  #domain: string;
  #dbName: string;
  #port: string;
  #Logger: any;

  constructor(options?: dbUrlOptsIF) {
    const logLevelEnv = options.logLevelEnv || "DEBUG";
    this.#Logger = new Logger(logLevelEnv);
    const params = this.#getDbParams(options);
    this.#urlOpts = params.urlOpts;
    this.#user = params.urlOpts.user;
    this.#pass = params.urlOpts.pass;
    this.#scheme = params.urlOpts.scheme;
    this.#domain = params.urlOpts.domain;
    this.#port = params.urlOpts.port;
    this.#dbName = params.urlOpts.dbName;
    this.#baseUrl = params.baseUrl;
    this.#dbUrl = params.dbUrl;
    this.#authHeader = params.authHeader;
    this.createDatabase();
  }

  #getDbParams(options?: dbUrlOptsIF) {
    const urlOpts = this.#getDbUrlOpts(options);
    const baseUrl = this.#getBaseUrl(urlOpts);
    const dbUrl = this.#getDbUrl(urlOpts);
    const authHeader = this.#getAuthHeader(urlOpts);
    return { urlOpts, baseUrl, dbUrl, authHeader };
  }

  #getDbUrlOpts(options?: dbUrlOptsIF): dbUrlOptsIF {
    if (!options?.user && !this.#user)
      throw "dbUrlOpts requires a 'user' property to be set either explicity or from the environment as DB_USER";

    if (!options?.pass && !this.#pass)
      throw "dbUrlOpts requires a 'pass' property to be set either explicity or from the environment as DB_PASS";

    if (!options?.dbName && !this.#dbName)
      throw "dbUrlOpts requires a 'dbName' property to be set either explicity or from the environment as DB_NAME";

    const dbUrlOpts: dbUrlOptsIF = {
      scheme: options?.scheme || this.#scheme || "http",
      domain: options?.domain || this.#domain || "localhost",
      port: options?.port || this.#port || "5984",
      dbName: options?.dbName || this.#dbName,
      user: options?.user || this.#user,
      pass: options?.pass || this.#pass,
    };

    return dbUrlOpts;
  }

  #getBaseUrl(options?: dbUrlOptsIF): string {
    const port = options?.port ? `:${options.port}` : "";
    const baseUrl = `${options.scheme}://${options.domain}${port}`;
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

  async createDatabase(options?: dbUrlOptsIF) {
    const { dbUrl, authHeader } = this.#getDbParams(options);

    this.#Logger.Log(
      { msg: "Creating Database if not exists.", dbUrl },
      LogLevel.INFO
    );

    const resp = await fetch(dbUrl, {
      method: "PUT",
      headers: new Headers({
        ...authHeader,
      }),
    });
    const data = await resp.json();
    return data;
  }

  async deleteDatabase(options?: dbUrlOptsIF) {
    const { dbUrl, authHeader } = this.#getDbParams(options);

    this.#Logger.Log({ msg: "Deleting Database.", dbUrl }, LogLevel.INFO);

    const resp = await fetch(dbUrl, {
      method: "DELETE",
      headers: new Headers({
        ...authHeader,
      }),
    });
    const data = await resp.json();
    return data;
  }

  async getCouchDbInfo(options?: dbUrlOptsIF) {
    const { baseUrl, authHeader } = this.#getDbParams(options);

    this.#Logger.Log(
      { msg: "Getting Couch Installation Info.", baseUrl },
      LogLevel.INFO
    );
    const resp = await fetch(baseUrl, {
      headers: new Headers({
        ...authHeader,
      }),
    });
    const data = await resp.json();
    return data;
  }

  async getDbInfo(options?: dbUrlOptsIF) {
    const { dbUrl, authHeader } = this.#getDbParams(options);

    this.#Logger.Log({ msg: "Getting DB Info.", dbUrl }, LogLevel.INFO);

    const resp = await fetch(dbUrl, {
      headers: new Headers({
        ...authHeader,
      }),
    });

    this.#Logger.Log({ msg: "getDbInfo Response", resp }, LogLevel.DEBUG);

    const data = await resp.json();
    return data;
  }

  /**
   * Get all the documents in the database
   * @returns - an array of documents
   */
  async allDocs(options?: dbUrlOptsIF) {
    const { dbUrl, authHeader } = this.#getDbParams(options);

    this.#Logger.Log({ msg: "Getting All Docs.", dbUrl }, LogLevel.INFO);

    const resp = await fetch(dbUrl + "/_all_docs?include_docs=true", {
      headers: new Headers({
        ...authHeader,
      }),
    });

    this.#Logger.Log({ msg: "allDocs Response", resp }, LogLevel.DEBUG);

    const data = await resp.json();
    return data.rows.map((row) => row.doc);
  }

  /**
   * Get a single document from the database
   * @param id - the id of the document to retrieve
   * @returns - the document object
   */
  async getDoc(id: string, options?: dbUrlOptsIF) {
    const { dbUrl, authHeader } = this.#getDbParams(options);

    this.#Logger.Log({ msg: "Get Doc.", id }, LogLevel.INFO);

    const resp = await fetch(dbUrl + "/" + id, {
      headers: new Headers({
        ...authHeader,
      }),
    });

    this.#Logger.Log({ msg: "Get Doc Response", resp }, LogLevel.DEBUG);

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
  async upsertDoc(doc, options?: dbUrlOptsIF) {
    const { dbUrl, authHeader } = this.#getDbParams(options);

    this.#Logger.Log({ msg: "PUT Doc.", dbUrl }, LogLevel.INFO);
    this.#Logger.Log({ msg: "Doc", doc }, LogLevel.DEBUG);

    if (!doc._id && !doc.id) throw "Doc needs an id property";
    if (doc.id) doc._id = doc.id;

    const existingDoc = await this.getDoc(doc._id);
    if (!existingDoc.error) doc._rev = existingDoc._rev;

    const resp = await fetch(dbUrl, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        ...authHeader,
      }),
      body: JSON.stringify(doc),
    });

    this.#Logger.Log({ msg: "upsertDoc Response", resp }, LogLevel.DEBUG);

    const data = await resp.json();
    return data;
  }
}

export default CouchDB;
