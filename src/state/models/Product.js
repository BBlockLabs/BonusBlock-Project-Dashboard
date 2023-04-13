import Model from "@/state/models/Model";

export default class Product extends Model {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  network;

  /**
   * @type {Array<String>}
   */
  categories = [];
}
