/**
 * Catalog of available CDS Hook services returned by discovery endpoint.
 */
import {DomainResource} from '@uukmm/ng-fhir-model/r4';
import {InstanceHandle} from './proxy-client';

export interface CdsHooksCatalog {
  /**
   * An array of CDS Services.
   */
  services: CdsHooksDescriptor[];
}

/**
 * Descriptor for an individual CDS Hook.
 */
export interface CdsHooksDescriptor {
  /**
   * The hook this service should be invoked on.
   */
  hook: 'patient-view' | 'medication-prescribe' | 'order-review' | string;
  /**
   * The human-friendly name of this service.
   */
  title?: string;
  /**
   * The description of this service.
   */
  description: string;
  /**
   * The {id} portion of the URL to this service which is available at {baseUrl}/cds-services/{id}
   */
  id: string;
  /**
   * An object containing key/value pairs of FHIR queries that this service is requesting that the EHR prefetch and
   * provide on each service call. The key is a string that describes the type of data being requested and the value
   * is a string representing the FHIR query.
   */
  prefetch?: CdsHooksPrefetchTemplate;
}

/**
 * Prefetch template for an individual CDS Hook.
 */
export interface CdsHooksPrefetchTemplate {
  [property: string]: string;
}

/**
 * Invocation request for an individual CDS Hook.
 */
export interface CdsHooksRequest {
  /**
   * The hook that triggered this CDS Service call.
   */
  hook: 'patient-view' | 'medication-prescribe' | 'order-review' | string;
  /**
   * A UUID for this particular hook call.
   */
  hookInstance: string;
  /**
   * The base URL EHR's FHIR server. If FHIR Authorization is provided, this field is REQUIRED. The scheme should be https.
   */
  fhirServer?: string;
  /**
   * A structure holding an OAuth 2.0 bearer access token granting the CDS Service access to FHIR resources,
   * along with supplemental information relating to the token.
   */
  fhirAuthorization?: CdsHooksFhirAuthorization;
  /**
   * Hook-specific contextual data that the CDS service will need.  For example, with the patient-view hook this will
   * include the FHIR identifier of the Patient being viewed.
   */
  context: any;
  /**
   * The FHIR data that was prefetched by the EHR.
   */
  prefetch?: CdsHooksPrefetchValues;
}

/**
 * Resolved prefetch values for a CDS Hook request.
 */
export interface CdsHooksPrefetchValues {
  [property: string]: string | DomainResource<any>;
}

/**
 * The FHIR authorization structure.
 */
export interface CdsHooksFhirAuthorization {
  /**
   * This is the OAuth 2.0 access token that provides access to the FHIR server.
   */
  access_token: string;
  /**
   * Fixed value: Bearer
   */
  token_type: 'Bearer';
  /**
   * The lifetime in seconds of the access token.
   */
  expires_in: number;
  /**
   * The scopes the access token grants the CDS Service.
   */
  scope: string;
  /**
   * The OAuth 2.0 client identifier of the CDS Service, as registered with the EHR's authorization server.
   */
  subject: string;
}

/**
 * A response to a CDS Hook request.
 */
export interface CdsHooksResponse {
  /**
   * An array of Cards. Cards can provide a combination of information (for reading), suggested actions (to be applied
   * if a user selects them), and links (to launch an app if the user selects them). The EHR decides how to display
   * cards, but this specification recommends displaying suggestions using buttons, and links using underlined text.
   */
  cards: CdsHooksCard[];

}

/**
 * A single CDS Hook card.  A card can provide a combination of information (for reading), suggested actions (to be
 * applied if a user selects them), and links (to launch an app if the user selects them). The EHR decides how to display
 * the card, but this specification recommends displaying suggestions using buttons, and links using underlined text.
 */
export interface CdsHooksCard {
  /**
   * One-sentence, <140-character summary message for display to the user inside of this card.
   */
  summary: string;
  /**
   * Optional detailed information to display; if provided MUST be represented in (GitHub Flavored) Markdown.
   * (For non-urgent cards, the EHR MAY hide these details until the user clicks a link like "view more details...").
   */
  detail?: string;
  /**
   * Urgency/importance of what this card conveys. Allowed values, in order of increasing urgency, are:
   * info, warning, critical. The EHR MAY use this field to help make UI display decisions such as sort order or coloring.
   */
  indicator: string;
  /**
   * Grouping structure for the Source of the information displayed on this card. The source should be the primary source
   * of guidance for the decision support the card represents.
   */
  source: CdsHooksSource;
  /**
   * Allows a service to suggest a set of changes in the context of the current activity (e.g. changing the dose of the
   * medication currently being prescribed, for the medication-prescribe activity). If suggestions are present,
   * selectionBehavior MUST also be provided.
   */
  suggestions?: CdsHooksSuggestion[];
  /**
   * Describes the intended selection behavior of the suggestions in the card. Currently, the only allowed value is
   * at-most-one, indicating that the user may choose none or at most one of the suggestions. Future versions of the
   * specification may expand this behavior, so EHRs that do not understand the value MUST treat the card as an error.
   * EHRs MUST support the value of at-most-one.
   */
  selectionBehavior?: string;
  /**
   * Allows a service to suggest a link to an app that the user might want to run for additional information or to help
   * guide a decision.
   */
  links?: CdsHooksLink[];
}

/**
 * Grouping structure for the source of the information displayed on a card.
 */
export interface CdsHooksSource {
  /**
   * A short, human-readable label to display for the source of the information displayed on this card.
   * If a url is also specified, this MAY be the text for the hyperlink.
   */
  label: string;
  /**
   * An optional absolute URL to load (via GET, in a browser context) when a user clicks on this link to learn more about
   * the organization or data set that provided the information on this card. Note that this URL should not be used to
   * supply a context-specific "drill-down" view of the information on this card. For that, use link.url instead.
   */
  url?: string;
  /**
   * An absolute URL to an icon for the source of this card. The icon returned by this URL SHOULD be a 100x100 pixel
   * PNG image without any transparent regions.
   */
  icon?: string;
}

/**
 * A single CDS Hook suggestion.
 */
export interface CdsHooksSuggestion {
  /**
   * Human-readable label to display for this suggestion (e.g. the EHR might render this as the text on a button tied
   * to this suggestion).
   */
  label: string;
  /**
   * Unique identifier, used for auditing and logging suggestions.
   */
  uuid: string;
  /**
   * Array of objects, each defining a suggested action. Within a suggestion, all actions are logically AND'd together,
   * such that a user selecting a suggestion selects all of the actions within it.
   */
  actions?: CdsHooksAction<any>[];
  /**
   * When there are multiple suggestions, allows a service to indicate that a specific suggestion is recommended from
   * all the available suggestions on the card. CDS Hooks clients may choose to influence their UI based on this value,
   * such as pre-selecting, or highlighting recommended suggestions. Multiple suggestions MAY be recommended,
   * if card.selectionBehavior is any.
   */
  isRecommended?: boolean;
}

/**
 * A suggested action.
 */
export interface CdsHooksAction<T extends DomainResource<any> | string> {
  /**
   * The type of action being performed. Allowed values are: create, update, delete.
   */
  type: 'create' | 'update' | 'delete';
  /**
   * Human-readable description of the suggested action MAY be presented to the end-user.
   */
  description: string;
  /**
   * Depending upon the type attribute, a new resource or the id of a resource. When the type attribute is create, the
   * resource attribute SHALL contain a new FHIR resource to be created. For delete, this SHALL be the id of the resource
   * to remove. In hooks where only one "content" resource is ever relevant, this attribute MAY be omitted for delete
   * action types only. For update, this holds the updated resource in its entirety and not just the changed fields.
   */
  resource?: T;
}

/**
 * Link to an app that the user might want to run for additional information or to help guide a decision.
 */
export interface CdsHooksLink {
  /**
   * Human-readable label to display for this link (e.g. the EHR might render this as the underlined text of a
   * clickable link).
   */
  label: string;
  /**
   * URL to load (via GET, in a browser context) when a user clicks on this link. Note that this MAY be a "deep link"
   * with context embedded in path segments, query parameters, or a hash.
   */
  url: string;
  /**
   * The type of the given URL. There are two possible values for this field. A type of absolute indicates that the URL
   * is absolute and should be treated as-is. A type of smart indicates that the URL is a SMART app launch URL and the
   * EHR should ensure the SMART app launch URL is populated with the appropriate SMART launch parameters.
   */
  type: string;
  /**
   * An optional field that allows the CDS Service to share information from the CDS card with a subsequently launched
   * SMART app. The appContext field should only be valued if the link type is smart and is not valid for absolute links.
   * The appContext field and value will be sent to the SMART app as part of the OAuth 2.0 access token response,
   * alongside the other SMART launch parameters when the SMART app is launched. Note that appContext could be escaped
   * JSON, base64 encoded XML, or even a simple string, so long as the SMART app can recognize it.
   */
  appContext?: string;
}

/**
 * Used to pass context information to prefetch templates.
 */
export interface CdsHooksContext {
  [property: string]: any;
}
