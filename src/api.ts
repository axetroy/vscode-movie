import axios, { AxiosError } from "axios";
import { window } from "vscode";

const headers = {
  Referer: "https://movie.douban.com/",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-HK;q=0.7",
  "Cache-Control": "max-age=0",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
};

const http = axios.create({
  headers,
  params: {
    apikey: "0df993c66c0c636e29ecbb5344252a4a"
  }
});

function errorHandler(err: AxiosError) {
  const { response, config } = err;
  const data = (response as any).data;
  if (data && data.msg) {
    const msg = data.msg;
    window.showErrorMessage(msg);
    console.error(`[${(config.method || "GET").toUpperCase()}]: ${config.url}`);
    console.error(config);
    return Promise.reject(err);
  }
  return Promise.reject(err);
}

export async function getHotMovie(city: string): Promise<any[]> {
  const { data } = await http
    .get("https://api.douban.com/v2/movie/in_theaters", {
      params: {
        city,
        count: 100
      }
    })
    .catch(errorHandler);

  return data.subjects;
}

export async function getTopMovie(
  initStart: number = 0,
  movie: any[] = []
): Promise<any[]> {
  const { data } = await http
    .get("https://api.douban.com/v2/movie/top250", {
      params: {
        start: initStart,
        count: 100
      }
    })
    .catch(errorHandler);

  const { start, total, subjects } = data;
  const num = subjects.length;

  // 如果还有下一页
  if (start + num < total) {
    return movie.concat(await getTopMovie(start + num, subjects));
  }

  return subjects;
}

export async function getUpcomingMovie(): Promise<any[]> {
  const { data } = await http
    .get("https://api.douban.com/v2/movie/coming_soon", {
      params: {
        count: 100
      }
    })
    .catch(errorHandler);

  return data.subjects;
}

export async function getTv(tag: string): Promise<any[]> {
  const { data } = await http
    .get("https://movie.douban.com/j/search_subjects", {
      params: {
        type: "tv",
        tag,
        page_limit: 100,
        page_start: 0
      }
    })
    .catch(errorHandler);

  return data.subjects;
}

export async function getTvTag(): Promise<string[]> {
  const { data } = await http
    .get("https://movie.douban.com/j/search_tags", {
      params: {
        type: "tv"
      }
    })
    .catch(errorHandler);

  return data.tags;
}

export async function getYourCity() {
  const { data } = await axios.get("http://locate.axetroy.xyz");

  return data.content.address_detail.city.replace(/\市$/, "");
}
