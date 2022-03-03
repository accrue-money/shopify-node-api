import Base, {ResourcePath} from '../../base-rest-resource';

interface AcceptArgs {
  [key: string]: unknown;
  message?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface RejectArgs {
  [key: string]: unknown;
  message?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class FulfillmentRequest extends Base {
  protected static NAME = 'fulfillment_request';
  protected static PLURAL_NAME = 'fulfillment_requests';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {http_method: "post", operation: "post", ids: ["fulfillment_order_id"], path: "fulfillment_orders/<fulfillment_order_id>/fulfillment_request.json"},
    {http_method: "post", operation: "accept", ids: ["fulfillment_order_id"], path: "fulfillment_orders/<fulfillment_order_id>/fulfillment_request/accept.json"},
    {http_method: "post", operation: "reject", ids: ["fulfillment_order_id"], path: "fulfillment_orders/<fulfillment_order_id>/fulfillment_request/reject.json"}
  ];

  public async accept(
    {
      message = null,
      body = null,
      ...otherArgs
    }: AcceptArgs
  ): Promise<unknown> {
    return await FulfillmentRequest.request({
      http_method: "post",
      operation: "accept",
      session: this.session,
      urlIds: {fulfillment_order_id: this.fulfillment_order_id},
      params: {message: message, ...otherArgs},
      body: body,
      entity: this,
    });
  }

  public async reject(
    {
      message = null,
      body = null,
      ...otherArgs
    }: RejectArgs
  ): Promise<unknown> {
    return await FulfillmentRequest.request({
      http_method: "post",
      operation: "reject",
      session: this.session,
      urlIds: {fulfillment_order_id: this.fulfillment_order_id},
      params: {message: message, ...otherArgs},
      body: body,
      entity: this,
    });
  }

  public fulfillment_order_id: number | null;
}
