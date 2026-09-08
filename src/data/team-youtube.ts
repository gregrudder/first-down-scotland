export type TeamYoutube = {
  url: string;
  handle: string;
  artworkUrl: string;
};

/**
 * Official club YouTube channels. Handles checked against youtube.com/@…
 * titles. Artwork is the channel avatar from yt3.googleusercontent.com.
 */
export const teamYoutube: Record<string, TeamYoutube> = {
  "arizona-cardinals": {
    handle: "@AZCardinals",
    url: "https://www.youtube.com/@AZCardinals",
    artworkUrl:
      "https://yt3.googleusercontent.com/gK_1YTOQWS9seym5OKyJ6VUyVMWTC_Xc_0uU_ocyeq391Or4W7-cjju5S_IjRAmnJmj9ebhVOow=s900-c-k-c0x00ffffff-no-rj",
  },
  "atlanta-falcons": {
    handle: "@AtlantaFalcons",
    url: "https://www.youtube.com/@AtlantaFalcons",
    artworkUrl:
      "https://yt3.googleusercontent.com/NVK2vkV_90i2FV_e-kazegz23Fk3dz3-dpCo9KRycA1tZLyTCt-5CHd5Zpb96z-8J10KCSytwg=s900-c-k-c0x00ffffff-no-rj",
  },
  "baltimore-ravens": {
    handle: "@BaltimoreRavens",
    url: "https://www.youtube.com/@BaltimoreRavens",
    artworkUrl:
      "https://yt3.googleusercontent.com/w1Z-Dn0Xuzd4gpBs9YDFY6jIiiE_Uw2lBfthEQthSnTt1UcWsUGYpqmFjuvR6GLG1yQEsY7Y=s900-c-k-c0x00ffffff-no-rj",
  },
  "buffalo-bills": {
    handle: "@buffalobills",
    url: "https://www.youtube.com/@buffalobills",
    artworkUrl:
      "https://yt3.googleusercontent.com/IGQZA2iM_bvkFZK-IkrW8cO7565909BBNdVhlBn4Aqoz6kTlnk0f8ZuxhJ75mJl7LLhVdsQLpg=s900-c-k-c0x00ffffff-no-rj",
  },
  "carolina-panthers": {
    handle: "@CarolinaPanthers",
    url: "https://www.youtube.com/@CarolinaPanthers",
    artworkUrl:
      "https://yt3.googleusercontent.com/ytc/AIdro_kLS6olQeHf3EIVOrCEoPxRXaX00BrJ1r9eTb1-sH0lww=s900-c-k-c0x00ffffff-no-rj",
  },
  "chicago-bears": {
    handle: "@chicagobears",
    url: "https://www.youtube.com/@chicagobears",
    artworkUrl:
      "https://yt3.googleusercontent.com/UXFVm8ioWrlr5t0IkN6XfTw7vFXISC7pVlEKIr6Em5T-BiDRSlxx1o3KRNGroeEbGnV1-9Fq=s900-c-k-c0x00ffffff-no-rj",
  },
  "cincinnati-bengals": {
    handle: "@bengals",
    url: "https://www.youtube.com/@bengals",
    artworkUrl:
      "https://yt3.googleusercontent.com/whSas_aAkDjsU5dFwnAN1KwaReEwXwHTkwbbJdYfdh5K_Erw49Zi4we-hJXawMqSLclXwfGB-g=s900-c-k-c0x00ffffff-no-rj",
  },
  "cleveland-browns": {
    handle: "@browns",
    url: "https://www.youtube.com/@browns",
    artworkUrl:
      "https://yt3.googleusercontent.com/qWv-qRCgAmzPimoFm-Lm5PQferDKoLqnk0wGh59ctSh7dD86V23woWbwtnBVaROfSFXjLm1O=s900-c-k-c0x00ffffff-no-rj",
  },
  "dallas-cowboys": {
    handle: "@dallascowboys",
    url: "https://www.youtube.com/@dallascowboys",
    artworkUrl:
      "https://yt3.googleusercontent.com/i5GhRvaC3fhDO3_uik_PLg-jL_9kCg3d7lzIBomInR_C2tnebyL_ufI_ZT4MJANuqPGLlM=s900-c-k-c0x00ffffff-no-rj",
  },
  "denver-broncos": {
    handle: "@broncos",
    url: "https://www.youtube.com/@broncos",
    artworkUrl:
      "https://yt3.googleusercontent.com/qfD4VprNhsKmp5ubzCJ75Z7hTPJ6sOPPJE_2PmCaH_PilKGeOVWntDm6AqjZJyIqBpS4QAKubeU=s900-c-k-c0x00ffffff-no-rj",
  },
  "detroit-lions": {
    handle: "@detroitlionsnfl",
    url: "https://www.youtube.com/@detroitlionsnfl",
    artworkUrl:
      "https://yt3.googleusercontent.com/3ICsOTxw_MBJrQkSizC4yYRwL__5AIGuP1f5CHpPdg2FRasNTNOkEsoFIjWbvcJMATcppXUgtA=s900-c-k-c0x00ffffff-no-rj",
  },
  "green-bay-packers": {
    handle: "@packers",
    url: "https://www.youtube.com/@packers",
    artworkUrl:
      "https://yt3.googleusercontent.com/uI7ircc1-Z1uNKBcBYtuQkqJ4TnGiYBPa6tY2UCt1V3Kvyi5aaN5u4GoHcekbYlEFJxNPUaOox8=s900-c-k-c0x00ffffff-no-rj",
  },
  "houston-texans": {
    handle: "@HoustonTexans",
    url: "https://www.youtube.com/@HoustonTexans",
    artworkUrl:
      "https://yt3.googleusercontent.com/roIH8env_qHaw0l0QBJE8CQ2aZAUHrtea4Yl-zbgZG0LbiaWt61_FpfoEG4fb8BCUW8I0G2E=s900-c-k-c0x00ffffff-no-rj",
  },
  "indianapolis-colts": {
    handle: "@colts",
    url: "https://www.youtube.com/@colts",
    artworkUrl:
      "https://yt3.googleusercontent.com/SeE9ciLSVG-uRuD85U88kjchNBzCLKO_ZKm1T-Kaxyi1-zalP33_2DjmuGh-MTsoYKo02Tyh=s900-c-k-c0x00ffffff-no-rj",
  },
  "jacksonville-jaguars": {
    handle: "@jaguars",
    url: "https://www.youtube.com/@jaguars",
    artworkUrl:
      "https://yt3.googleusercontent.com/g75Gj_3ox5srItZ_owHuHv0CRZKbGW7UmLnCh4RGH18UvgABdDNqxncU7Zemm2yeVNbjV_uTL5Q=s900-c-k-c0x00ffffff-no-rj",
  },
  "kansas-city-chiefs": {
    handle: "@KansasCityChiefs",
    url: "https://www.youtube.com/@KansasCityChiefs",
    artworkUrl:
      "https://yt3.googleusercontent.com/1z6HIQus5C3CeXSd3ERaemaW2KSyqz0CrbuZbl65vi3bkVkVPbc-tmA0vNjARhyM37AwYk51lQ=s900-c-k-c0x00ffffff-no-rj",
  },
  "las-vegas-raiders": {
    handle: "@raiders",
    url: "https://www.youtube.com/@raiders",
    artworkUrl:
      "https://yt3.googleusercontent.com/9iyoX68aQj63A9P0_YI_kOHF2NBOthoccr3pr1MDtp36vP5_T5iJNS0qsyf8U34lgOveMkWxzw=s900-c-k-c0x00ffffff-no-rj",
  },
  "los-angeles-chargers": {
    handle: "@chargers",
    url: "https://www.youtube.com/@chargers",
    artworkUrl:
      "https://yt3.googleusercontent.com/ytc/AIdro_nWjUzXng4KFtjjqWmmjM92FWKjR7VV5iGm9iYCqwUQeQk=s900-c-k-c0x00ffffff-no-rj",
  },
  "los-angeles-rams": {
    handle: "@LARams",
    url: "https://www.youtube.com/@LARams",
    artworkUrl:
      "https://yt3.googleusercontent.com/e1XK-WKwmyQUGkwdMopMzMUd-_HXhhPvJo3GKFTqpF4MjU2yP8EdE5JSgSIqdvdCDjQkmKgyUA=s900-c-k-c0x00ffffff-no-rj",
  },
  "miami-dolphins": {
    handle: "@MiamiDolphins",
    url: "https://www.youtube.com/@MiamiDolphins",
    artworkUrl:
      "https://yt3.googleusercontent.com/ytc/AIdro_kqniNH-xACFHLh8NfxkmnY2HevXijBqUMQ7F3rFnGozr4=s900-c-k-c0x00ffffff-no-rj",
  },
  "minnesota-vikings": {
    handle: "@vikings",
    url: "https://www.youtube.com/@vikings",
    artworkUrl:
      "https://yt3.googleusercontent.com/8Cyn6hs14KKSyi5-zuCVhDwMhEbHUdUzJk8me170Dv3_ht1olPmARheD3iSO6qMc0mJyKFvcsA=s900-c-k-c0x00ffffff-no-rj",
  },
  "new-england-patriots": {
    handle: "@patriots",
    url: "https://www.youtube.com/@patriots",
    artworkUrl:
      "https://yt3.googleusercontent.com/MPOC7hkCR1hdBdC2v2-45iC-803XSeTQERkdGaDMs8KhMsc3pcpIKAyktfI9nISyVC98qc5qQvM=s900-c-k-c0x00ffffff-no-rj",
  },
  "new-orleans-saints": {
    handle: "@NewOrleansSaints",
    url: "https://www.youtube.com/@NewOrleansSaints",
    artworkUrl:
      "https://yt3.googleusercontent.com/Ixm1--RGCp15Z0aiKwQ1oZCdFmKJIqwdHmae1-9HFMLxGQ5IXrjXjDQ6bceHem5F_n51NqWbMw=s900-c-k-c0x00ffffff-no-rj",
  },
  "new-york-giants": {
    handle: "@NYGiants",
    url: "https://www.youtube.com/@NYGiants",
    artworkUrl:
      "https://yt3.googleusercontent.com/Px1PDS9Rn0UTEQJdwa7rGC6z72ry95dwZScLduAIngvtPq2ZryHIh_p64NCibWazjvk8YRo=s900-c-k-c0x00ffffff-no-rj",
  },
  "new-york-jets": {
    handle: "@nyjets",
    url: "https://www.youtube.com/@nyjets",
    artworkUrl:
      "https://yt3.googleusercontent.com/CfPA3VFm4zlqJGEinG2j-dcERkr3ntg8c5HHUo21mAHoTL_IPUeUXw1pcIM0B5qlGlNklaNI=s900-c-k-c0x00ffffff-no-rj",
  },
  "philadelphia-eagles": {
    handle: "@eagles",
    url: "https://www.youtube.com/@eagles",
    artworkUrl:
      "https://yt3.googleusercontent.com/jMq3wFuQyV2qv6VYJMD6-cgH-jL_9kCg3d7lzIBomInR_C2tnebyL_ufI_ZT4MJANuqPGLlM=s900-c-k-c0x00ffffff-no-rj",
  },
  "pittsburgh-steelers": {
    handle: "@steelers",
    url: "https://www.youtube.com/@steelers",
    artworkUrl:
      "https://yt3.googleusercontent.com/9F29S4hVL_lbGKf3TYCRATs5oEY_wrXo6Z3cgqFnGcFhuMqEG5boI5J75vKInyF30MtL0kk1sg=s900-c-k-c0x00ffffff-no-rj",
  },
  "san-francisco-49ers": {
    handle: "@49ers",
    url: "https://www.youtube.com/@49ers",
    artworkUrl:
      "https://yt3.googleusercontent.com/tv84m8j1xfIVf_5yNJRVROBSPJkP5OW_8pmH_154ylp-_Drstxp5YzvI0WWuTO2zk2c5ze3L=s900-c-k-c0x00ffffff-no-rj",
  },
  "seattle-seahawks": {
    handle: "@Seahawks",
    url: "https://www.youtube.com/@Seahawks",
    artworkUrl:
      "https://yt3.googleusercontent.com/8ja9QNYcKlCInJjkF6BUxPJ6hgNAzlJHOqcEkn_HMIJr8CxRZ--ZY_3BrgwsZgZUvXwmQlLe7Xk=s900-c-k-c0x00ffffff-no-rj",
  },
  "tampa-bay-buccaneers": {
    handle: "@buccaneers",
    url: "https://www.youtube.com/@buccaneers",
    artworkUrl:
      "https://yt3.googleusercontent.com/XQqymxOz2dPp5PQ5FlZR-Q8llXorwueKrlY_fvDFLG_MYw2WbffIFEOkLl1E6YAA_cEv0Bw6AA=s900-c-k-c0x00ffffff-no-rj",
  },
  "tennessee-titans": {
    handle: "@Titans",
    url: "https://www.youtube.com/@Titans",
    artworkUrl:
      "https://yt3.googleusercontent.com/ZnIV9wsxKQ-L2uSf_gznYykBJSMxEC-CvxEJFZtgI5lSBUVs3lnp0Hk5ELtc1L-zAEtnZGRE6g0=s900-c-k-c0x00ffffff-no-rj",
  },
  "washington-commanders": {
    handle: "@Commanders",
    url: "https://www.youtube.com/@Commanders",
    artworkUrl:
      "https://yt3.googleusercontent.com/DNfA_HjnTbftjbKDURVRMQ_g9N45a_Lcfm4Ta07jPcp47Ew8gANX-exuegl2agf0cWrJ1RwEbHw=s900-c-k-c0x00ffffff-no-rj",
  },
};

export function getTeamYoutube(slug: string): TeamYoutube | undefined {
  return teamYoutube[slug];
}
