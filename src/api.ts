import axios from "axios";
import { window } from "vscode";

function errorHandler(err: any) {
  const { response } = err;
  const data = response.data;
  if (data && data.msg) {
    const msg = "请求过于频繁，请稍后重试.";
    window.showErrorMessage(msg);
    return Promise.reject(msg);
  }
  return Promise.reject(err);
}

export async function getHotMovie(city: string): Promise<any[]> {
  const { data } = await axios
    .get("https://api.douban.com/v2/movie/in_theaters", {
      params: {
        city,
        count: 100
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
    .catch(errorHandler);

  return data.subjects;
}

export async function getTopMovie(
  initStart: number = 0,
  movie: any[] = []
): Promise<any[]> {
  const { data } = await axios
    .get("https://api.douban.com/v2/movie/top250", {
      params: {
        start: initStart,
        count: 100
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
    .catch(errorHandler);

  const { start, total } = data;
  const num = data.subjects.length;

  // 如果还有下一页
  if (start + num < total) {
    return movie.concat(await getTopMovie(start + num, data.subjects));
  }

  return data.subjects;
}

export async function getYourCity() {
  const { data } = await axios.get("http://api.map.baidu.com/location/ip", {
    params: {
      ak: "lGcipWTYZyE4ZvnIlZIy2dF8LmVlZ6P5" // app key
    }
  });

  return data.content.address_detail.city.replace(/\市$/, "");
}
