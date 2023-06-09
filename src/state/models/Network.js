import Model from "@/state/models/Model";

export default class Network extends Model {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  denom;

  /**
   * @type {number}
   */
  decimal = 0;

  /**
   * @param {NetworkDto} networkDto
   * @return {Network}
   */
  static fromDto(networkDto) {
    const network = new Network();

    network.id = networkDto.id;
    network.name = networkDto.name;
    network.denom = networkDto.denom;
    network.decimal = networkDto.decimal;

    return network;
  }
}
