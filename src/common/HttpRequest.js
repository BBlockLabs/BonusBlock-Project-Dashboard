import moment from "moment/moment.js";
import UserSessionDto from "@/common/dto/UserSessionDto.js";

export class HttpRequest {
  /**
   * @type {UserSessionDto}
   */
  session = null;
  /**
   * @param {String} endpoint
   * @param {Object} data
   * @return {Object}
   */
  static async makeRequest(endpoint, data = null) {
    let request = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (data !== null) {
      request["body"] = JSON.stringify(data);
      request["method"] = "POST";
    }

    if (this.session) {
      request["headers"]["X-Auth-Token"] = this.session.token;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`,
      request
    );

    if (response.status === 401) {
      // user is logged out
      this.session = null;
    }

    if (!response.ok) {
      return { error: "response error" };
    }

    const jsonData = await response.json();

    if (jsonData.error) {
      return { error: jsonData.errors };
    }

    if (!jsonData.payload) {
      // requests with empty response
      return {};
    }

    if (jsonData.payload.session) {
      // auto-populate session info from server response
      HttpRequest.setSession(
        jsonData.payload.session.token,
        moment(jsonData.payload.session.expiresOn)
      );

      localStorage.setItem("token", this.session.token);
      localStorage.setItem("tokenExpire", this.session.expiresOn.toISOString());
    }

    return { payload: jsonData.payload };
  }
  /**
   * @param {String} token
   * @param {moment.Moment} expiresOn
   */
  static setSession(token, expiresOn) {
    if (token == null && expiresOn == null) {
      this.session = null;
    } else {
      this.session = new UserSessionDto({
        token: token,
        expiresOn: expiresOn,
      });
    }
  }
}