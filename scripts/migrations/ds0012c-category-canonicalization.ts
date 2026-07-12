import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import {
  CANONICAL_ARCHIVE_STRATEGY,
  CANONICAL_SLUG_PREFERENCES,
} from "../../app/lib/categories/categoryCanonicalMapping";
import {
  normalizeCategoryText,
  normalizedComparableKey,
  normalizeToNfc,
} from "../../app/lib/categories/unicodeNormalizer";

type FkColumn = {
  table: string;
  column: string;
};

type CategoryRecord = {
  id: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  bgName: string;
  enName: string;
};

type CategoryCanonicalMapping = {
  oldCategoryId: string;
  canonicalCategoryId: string;
  reason: string;
};

type TranslationConflict = {
  oldCategoryId: string;
  canonicalCategoryId: string;
  locale: string;
  oldTranslationId: string;
  canonicalTranslationId: string;
  oldName: string;
  canonicalName: string;
  oldSeoSlug: string;
  canonicalSeoSlug: string;
};

type ManualTranslationResolution = {
  oldTranslationId: string;
  canonicalTranslationId: string;
};

const MANUAL_TRANSLATION_RESOLUTIONS: ManualTranslationResolution[] = [
  { oldTranslationId: "cmrgjoyjl0005evv0ud3cgz84", canonicalTranslationId: "ct_cmrgfrwta000k24v0vy6vxpjn_bg" },
  { oldTranslationId: "cmrgjoylg0006evv04srue7t5", canonicalTranslationId: "ct_cmrgfrwta000k24v0vy6vxpjn_en" },
  { oldTranslationId: "cmrgjp1s40015evv0lu09d7sd", canonicalTranslationId: "ct_cmrgfrxeu000t24v00wi34613_bg" },
  { oldTranslationId: "cmrgjp1ud0016evv0wdco0btp", canonicalTranslationId: "ct_cmrgfrxeu000t24v00wi34613_en" },
  { oldTranslationId: "cmrgjp1ya0018evv0nhwqejww", canonicalTranslationId: "ct_cmrgfrxix000u24v0zhinic6b_bg" },
  { oldTranslationId: "cmrgjp1zu0019evv0w734sj6f", canonicalTranslationId: "ct_cmrgfrxix000u24v0zhinic6b_en" },
  { oldTranslationId: "cmrgjp28r001eevv0g2i6acix", canonicalTranslationId: "ct_cmrgfrxth000x24v0iqqtusxq_bg" },
  { oldTranslationId: "cmrgjp2af001fevv0xdo3etf5", canonicalTranslationId: "ct_cmrgfrxth000x24v0iqqtusxq_en" },
  { oldTranslationId: "cmrgjp2q8001nevv03hwjku92", canonicalTranslationId: "ct_cmrgfrxym000z24v0fn5zeujp_bg" },
  { oldTranslationId: "cmrgjp2s3001oevv0lsfypra7", canonicalTranslationId: "ct_cmrgfrxym000z24v0fn5zeujp_en" },
  { oldTranslationId: "cmrgjp2vs001qevv0sw96bvw7", canonicalTranslationId: "ct_cmrgfrxvt000y24v0k2stkc90_bg" },
  { oldTranslationId: "cmrgjp2xe001revv0ltmj91zo", canonicalTranslationId: "ct_cmrgfrxvt000y24v0k2stkc90_en" },
  { oldTranslationId: "cmrgjp30z001tevv0zmlspdq3", canonicalTranslationId: "ct_cmrgfry0k001024v09q4kafk1_bg" },
  { oldTranslationId: "cmrgjp32n001uevv0nysk2owa", canonicalTranslationId: "ct_cmrgfry0k001024v09q4kafk1_en" },
  { oldTranslationId: "cmrgjp3bf001zevv0x1qgypsp", canonicalTranslationId: "ct_cmrgfry6e001224v0endr8pft_bg" },
  { oldTranslationId: "cmrgjp3ec0020evv0kk8avqra", canonicalTranslationId: "ct_cmrgfry6e001224v0endr8pft_en" },
  { oldTranslationId: "cmrgjp44b002eevv0fwkyr1a9", canonicalTranslationId: "ct_cmrgfrydw001524v0sc1peq26_bg" },
  { oldTranslationId: "cmrgjp47h002fevv07hve5e2v", canonicalTranslationId: "ct_cmrgfrydw001524v0sc1peq26_en" },
  { oldTranslationId: "cmrgjp4aw002hevv0ijzsdync", canonicalTranslationId: "ct_cmrgfryig001624v0q0gsu2ev_bg" },
  { oldTranslationId: "cmrgjp4cv002ievv0ugjdiwid", canonicalTranslationId: "ct_cmrgfryig001624v0q0gsu2ev_en" },
  { oldTranslationId: "cmrgjp4gd002kevv08afn9jv7", canonicalTranslationId: "ct_cmrgfryq5001924v0h4pzwbc8_bg" },
  { oldTranslationId: "cmrgjp4i2002levv0aouviw23", canonicalTranslationId: "ct_cmrgfryq5001924v0h4pzwbc8_en" },
  { oldTranslationId: "cmrgjp4lk002nevv0kf59stb8", canonicalTranslationId: "ct_cmrgfrysm001a24v0q11210sk_bg" },
  { oldTranslationId: "cmrgjp4nf002oevv00ad24zr7", canonicalTranslationId: "ct_cmrgfrysm001a24v0q11210sk_en" },
  { oldTranslationId: "cmrgjp4qn002qevv0am9wizw4", canonicalTranslationId: "ct_cmrgfryo7001824v05ybrryyx_bg" },
  { oldTranslationId: "cmrgjp4se002revv07lkrze0h", canonicalTranslationId: "ct_cmrgfryo7001824v05ybrryyx_en" },
  { oldTranslationId: "cmrgjp593002zevv0n6w577x4", canonicalTranslationId: "ct_cmrgfryxo001b24v09d9t9yzq_bg" },
  { oldTranslationId: "cmrgjp5bj0030evv07o3m09hy", canonicalTranslationId: "ct_cmrgfryxo001b24v09d9t9yzq_en" },
  { oldTranslationId: "cmrgjp5lm0035evv0josbg66q", canonicalTranslationId: "ct_cmrgfrz27001c24v0cv2m2rb8_bg" },
  { oldTranslationId: "cmrgjp5nk0036evv0cby7g3rt", canonicalTranslationId: "ct_cmrgfrz27001c24v0cv2m2rb8_en" },
  { oldTranslationId: "cmrgjp5rf0038evv07fa92eyu", canonicalTranslationId: "ct_cmrgfrz59001d24v0i5z351n0_bg" },
  { oldTranslationId: "cmrgjp5tx0039evv0sece200e", canonicalTranslationId: "ct_cmrgfrz59001d24v0i5z351n0_en" },
  { oldTranslationId: "cmrgjp5xf003bevv03at65abq", canonicalTranslationId: "ct_cmrgfrz6y001e24v0untzeqj1_bg" },
  { oldTranslationId: "cmrgjp5zb003cevv0f35bg1re", canonicalTranslationId: "ct_cmrgfrz6y001e24v0untzeqj1_en" },
  { oldTranslationId: "cmrgjp6ep003kevv0d65c5t4m", canonicalTranslationId: "ct_cmrgfrzia001h24v0wjl0dnod_bg" },
  { oldTranslationId: "cmrgjp6gi003levv0qnl8moif", canonicalTranslationId: "ct_cmrgfrzia001h24v0wjl0dnod_en" },
  { oldTranslationId: "cmrgjp6qb003qevv0cq9vx37n", canonicalTranslationId: "ct_cmrgfrzlq001i24v0qjsn8hht_bg" },
  { oldTranslationId: "cmrgjp6rz003revv0bd8c9ap9", canonicalTranslationId: "ct_cmrgfrzlq001i24v0qjsn8hht_en" },
  { oldTranslationId: "cmrgjp71f003wevv0adj2fw64", canonicalTranslationId: "ct_cmrgfrzqu001j24v0glbei37b_bg" },
  { oldTranslationId: "cmrgjp737003xevv0x8yvylvi", canonicalTranslationId: "ct_cmrgfrzqu001j24v0glbei37b_en" },
  { oldTranslationId: "cmrgjp76u003zevv0nvpwmufe", canonicalTranslationId: "ct_cmrgfrzvd001k24v039gtql5u_bg" },
  { oldTranslationId: "cmrgjp78o0040evv0f2weyq3e", canonicalTranslationId: "ct_cmrgfrzvd001k24v039gtql5u_en" },
  { oldTranslationId: "cmrgjp8ik004nevv04hosvu7a", canonicalTranslationId: "ct_cmrgfs09r001o24v0efjm7yem_bg" },
  { oldTranslationId: "cmrgjp8kg004oevv06s9l99tr", canonicalTranslationId: "ct_cmrgfs09r001o24v0efjm7yem_en" },
  { oldTranslationId: "cmrgjp8yl004wevv0a1te51c2", canonicalTranslationId: "ct_cmrgfs0eu001q24v0g3u77yd6_bg" },
  { oldTranslationId: "cmrgjp929004xevv0u6z52g6s", canonicalTranslationId: "ct_cmrgfs0eu001q24v0g3u77yd6_en" },
  { oldTranslationId: "cmrgjp9hl0055evv0t3m0yb0g", canonicalTranslationId: "ct_cmrgfs0rf001t24v01qai1ubc_bg" },
  { oldTranslationId: "cmrgjp9j70056evv0zsoihxmw", canonicalTranslationId: "ct_cmrgfs0rf001t24v01qai1ubc_en" },
  { oldTranslationId: "cmrgjp9ra0058evv0tc6n4iya", canonicalTranslationId: "ct_cmrgfs0t6001u24v0qx3zafv8_bg" },
  { oldTranslationId: "cmrgjp9sz0059evv0orjiqtwt", canonicalTranslationId: "ct_cmrgfs0t6001u24v0qx3zafv8_en" },
  { oldTranslationId: "cmrgjpa7j005eevv0rpmpo9fb", canonicalTranslationId: "ct_cmrgfs12w001w24v070p96gb3_bg" },
  { oldTranslationId: "cmrgjpa9b005fevv033ft81o8", canonicalTranslationId: "ct_cmrgfs12w001w24v070p96gb3_en" },
  { oldTranslationId: "cmrgjpayw005nevv0ot4ql5bu", canonicalTranslationId: "ct_cmrgfs14v001x24v0f8ale6ha_bg" },
  { oldTranslationId: "cmrgjpb0l005oevv0ebz5718z", canonicalTranslationId: "ct_cmrgfs14v001x24v0f8ale6ha_en" },
  { oldTranslationId: "cmrgjpb53005qevv07eo0rsqg", canonicalTranslationId: "ct_cmrgfs17z001y24v0tc2nrgqc_bg" },
  { oldTranslationId: "cmrgjpba5005revv07io29ou5", canonicalTranslationId: "ct_cmrgfs17z001y24v0tc2nrgqc_en" },
  { oldTranslationId: "cmrgjpdpw006eevv01d7t0c5e", canonicalTranslationId: "ct_cmrgfs1r5002424v0s4iqdtmw_bg" },
  { oldTranslationId: "cmrgjpdu1006fevv0dac5veth", canonicalTranslationId: "ct_cmrgfs1r5002424v0s4iqdtmw_en" },
  { oldTranslationId: "cmrgjpdz4006hevv0ycxycy9f", canonicalTranslationId: "ct_cmrgfs1v7002524v0fx1vk1p7_bg" },
  { oldTranslationId: "cmrgjpe3m006ievv0vkinplg3", canonicalTranslationId: "ct_cmrgfs1v7002524v0fx1vk1p7_en" },
  { oldTranslationId: "cmrgjpe9j006kevv0bq8prs8a", canonicalTranslationId: "ct_cmrgfs1wz002624v05ey6eu5b_bg" },
  { oldTranslationId: "cmrgjpeb7006levv0uy6bds9i", canonicalTranslationId: "ct_cmrgfs1wz002624v05ey6eu5b_en" },
  { oldTranslationId: "cmrgjpefi006nevv0fvi3miru", canonicalTranslationId: "ct_cmrgfs1ys002724v0wyo86q2q_bg" },
  { oldTranslationId: "cmrgjpeh5006oevv0g53fagum", canonicalTranslationId: "ct_cmrgfs1ys002724v0wyo86q2q_en" },
  { oldTranslationId: "cmrgjpekv006qevv06bvhzjhl", canonicalTranslationId: "ct_cmrgfs20y002824v0jvizi4q8_bg" },
  { oldTranslationId: "cmrgjpemr006revv01hoy0ywm", canonicalTranslationId: "ct_cmrgfs20y002824v0jvizi4q8_en" },
  { oldTranslationId: "cmrgjpex7006wevv01z455w6b", canonicalTranslationId: "ct_cmrgfs24d002a24v0p3kyl2zj_bg" },
  { oldTranslationId: "cmrgjpeyw006xevv0h8x3busu", canonicalTranslationId: "ct_cmrgfs24d002a24v0p3kyl2zj_en" },
  { oldTranslationId: "cmrgjpfdx0075evv0bujkdild", canonicalTranslationId: "ct_cmrgfs266002b24v04aqoresu_bg" },
  { oldTranslationId: "cmrgjpffn0076evv0v07tgbp8", canonicalTranslationId: "ct_cmrgfs266002b24v04aqoresu_en" },
  { oldTranslationId: "cmrgjpfla0078evv096o16953", canonicalTranslationId: "ct_cmrgfs283002c24v0bp1cr1wn_bg" },
  { oldTranslationId: "cmrgjpfn40079evv093uc56o0", canonicalTranslationId: "ct_cmrgfs283002c24v0bp1cr1wn_en" },
  { oldTranslationId: "cmrgjpfqt007bevv0xb8dljt3", canonicalTranslationId: "ct_cmrgfs29v002d24v0jexgtfpg_bg" },
  { oldTranslationId: "cmrgjpfsn007cevv0xwgvjpai", canonicalTranslationId: "ct_cmrgfs29v002d24v0jexgtfpg_en" },
  { oldTranslationId: "cmrgjpg1q007hevv08w81461m", canonicalTranslationId: "ct_cmrgfs2hf002g24v0o7mgpuu4_bg" },
  { oldTranslationId: "cmrgjpg3t007ievv017mr7bun", canonicalTranslationId: "ct_cmrgfs2hf002g24v0o7mgpuu4_en" },
  { oldTranslationId: "cmrgjpg7o007kevv0jafaey2f", canonicalTranslationId: "ct_cmrgfs2fm002f24v0w78ozgbm_bg" },
  { oldTranslationId: "cmrgjpg9i007levv0sihibpx2", canonicalTranslationId: "ct_cmrgfs2fm002f24v0w78ozgbm_en" },
  { oldTranslationId: "cmrgjphav0085evv02u0w7qd9", canonicalTranslationId: "ct_cmrgfs3hy002z24v0ooa95no6_bg" },
  { oldTranslationId: "cmrgjphci0086evv0gvope19b", canonicalTranslationId: "ct_cmrgfs3hy002z24v0ooa95no6_en" },
  { oldTranslationId: "cmrgjphfy0088evv0rl3cw57l", canonicalTranslationId: "ct_cmrgfs3k4003024v0xl6ti0zj_bg" },
  { oldTranslationId: "cmrgjphhq0089evv07xp6g7gd", canonicalTranslationId: "ct_cmrgfs3k4003024v0xl6ti0zj_en" },
  { oldTranslationId: "cmrgjphla008bevv09y50pqjs", canonicalTranslationId: "ct_cmrgfs3m4003124v0rsd6prax_bg" },
  { oldTranslationId: "cmrgjphn7008cevv0yfxguxgu", canonicalTranslationId: "ct_cmrgfs3m4003124v0rsd6prax_en" },
  { oldTranslationId: "cmrgjphqv008eevv06eiuaj1n", canonicalTranslationId: "ct_cmrgfs3nw003224v0fs6ig7id_bg" },
  { oldTranslationId: "cmrgjphsu008fevv0dxq11dec", canonicalTranslationId: "ct_cmrgfs3nw003224v0fs6ig7id_en" },
  { oldTranslationId: "cmrgjpidf008qevv07l8ysrd7", canonicalTranslationId: "ct_cmrgfs3rp003424v0evb5yp3y_bg" },
  { oldTranslationId: "cmrgjpifd008revv050npripr", canonicalTranslationId: "ct_cmrgfs3rp003424v0evb5yp3y_en" },
  { oldTranslationId: "cmrgjpj0i0092evv0eic3muxp", canonicalTranslationId: "ct_cmrgfs41n003924v0jfcl3sp5_bg" },
  { oldTranslationId: "cmrgjpj270093evv0s1oqukhi", canonicalTranslationId: "ct_cmrgfs41n003924v0jfcl3sp5_en" },
  { oldTranslationId: "cmrgjpj5t0095evv089xhga2u", canonicalTranslationId: "ct_cmrgfs3v5003624v0i48yd7uh_bg" },
  { oldTranslationId: "cmrgjpj7u0096evv0qk7dalxb", canonicalTranslationId: "ct_cmrgfs3v5003624v0i48yd7uh_en" },
  { oldTranslationId: "cmrgjpjms009eevv00vhfffau", canonicalTranslationId: "ct_cmrgfs4v3003o24v0ems7in98_bg" },
  { oldTranslationId: "cmrgjpjos009fevv08tbby59e", canonicalTranslationId: "ct_cmrgfs4v3003o24v0ems7in98_en" },
  { oldTranslationId: "cmrgjpjsl009hevv0h2cyq013", canonicalTranslationId: "ct_cmrgfs4ws003p24v07nzahqdh_bg" },
  { oldTranslationId: "cmrgjpju8009ievv0c1ibysfz", canonicalTranslationId: "ct_cmrgfs4ws003p24v07nzahqdh_en" },
  { oldTranslationId: "cmrgjpjxv009kevv02t13z82i", canonicalTranslationId: "ct_cmrgfs4yl003q24v04vzew3a0_bg" },
  { oldTranslationId: "cmrgjpjzr009levv0u1atuzk2", canonicalTranslationId: "ct_cmrgfs4yl003q24v04vzew3a0_en" },
  { oldTranslationId: "cmrgjpk3d009nevv0uysy6wk2", canonicalTranslationId: "ct_cmrgfs50i003r24v04m2mfm8b_bg" },
  { oldTranslationId: "cmrgjpk5b009oevv0rzotrv6b", canonicalTranslationId: "ct_cmrgfs50i003r24v04m2mfm8b_en" },
  { oldTranslationId: "cmrgjpl1p00a5evv0lho0c3aq", canonicalTranslationId: "ct_cmrgfs57g003v24v0yv1wval5_bg" },
  { oldTranslationId: "cmrgjpl3h00a6evv0s4e87zl8", canonicalTranslationId: "ct_cmrgfs57g003v24v0yv1wval5_en" },
  { oldTranslationId: "cmrgjpl8z00a8evv0oa5gxcyj", canonicalTranslationId: "ct_cmrgfs596003w24v0o4trcoau_bg" },
  { oldTranslationId: "cmrgjplap00a9evv0q960vmdt", canonicalTranslationId: "ct_cmrgfs596003w24v0o4trcoau_en" },
  { oldTranslationId: "cmrgjplvd00akevv0oama6ck3", canonicalTranslationId: "ct_cmrgfs5i2004124v0jgj6b79v_bg" },
  { oldTranslationId: "cmrgjplwx00alevv0cs5inhhd", canonicalTranslationId: "ct_cmrgfs5i2004124v0jgj6b79v_en" },
  { oldTranslationId: "cmrgjpmlb00awevv0d4jyk32n", canonicalTranslationId: "ct_cmrgfs2l6002i24v0xgqfz9aq_bg" },
  { oldTranslationId: "cmrgjpmpb00axevv0kann0juf", canonicalTranslationId: "ct_cmrgfs2l6002i24v0xgqfz9aq_en" },
  { oldTranslationId: "cmrgjpmth00azevv0q3mxt67a", canonicalTranslationId: "ct_cmrgfs2nb002j24v0t2epn336_bg" },
  { oldTranslationId: "cmrgjpmvf00b0evv0u813ssmn", canonicalTranslationId: "ct_cmrgfs2nb002j24v0t2epn336_en" },
  { oldTranslationId: "cmrgjpnb000b5evv0vmv18ug8", canonicalTranslationId: "ct_cmrgfs2qw002l24v0d3wvjl5s_bg" },
  { oldTranslationId: "cmrgjpncy00b6evv0hvdon3pe", canonicalTranslationId: "ct_cmrgfs2qw002l24v0d3wvjl5s_en" },
  { oldTranslationId: "cmrgjpnsx00bbevv0ms4fysjf", canonicalTranslationId: "ct_cmrgfs2un002n24v083hgf32u_bg" },
  { oldTranslationId: "cmrgjpny600bcevv0i1asahkh", canonicalTranslationId: "ct_cmrgfs2un002n24v083hgf32u_en" },
  { oldTranslationId: "cmrgjpqde00bzevv0ijgmpfs8", canonicalTranslationId: "ct_cmrgfs36u002t24v02wamy1e5_bg" },
  { oldTranslationId: "cmrgjpqfc00c0evv0dhzs884v", canonicalTranslationId: "ct_cmrgfs36u002t24v02wamy1e5_en" },
  { oldTranslationId: "cmrgjpqws00c5evv0gvujvqlz", canonicalTranslationId: "ct_cmrgfs3a8002v24v0ud12m89k_bg" },
  { oldTranslationId: "cmrgjpr1o00c6evv0vms1p6c8", canonicalTranslationId: "ct_cmrgfs3a8002v24v0ud12m89k_en" },
  { oldTranslationId: "cmrgjprif00ceevv0j7sr0qye", canonicalTranslationId: "ct_cmrgfs4g9003h24v0qg0m3svq_bg" },
  { oldTranslationId: "cmrgjprkl00cfevv07rulzp6p", canonicalTranslationId: "ct_cmrgfs4g9003h24v0qg0m3svq_en" },
  { oldTranslationId: "cmrgjprpu00chevv0lyxmbwdz", canonicalTranslationId: "ct_cmrgfs4id003i24v0uvjp4d7a_bg" },
  { oldTranslationId: "cmrgjprrs00cievv0d17azfj0", canonicalTranslationId: "ct_cmrgfs4id003i24v0uvjp4d7a_en" },
  { oldTranslationId: "cmrgjps1a00cnevv05k3szqyb", canonicalTranslationId: "ct_cmrgfs4lo003k24v0exfo7cvf_bg" },
  { oldTranslationId: "cmrgjps2x00coevv0d179yuiv", canonicalTranslationId: "ct_cmrgfs4lo003k24v0exfo7cvf_en" },
  { oldTranslationId: "cmrgjps6c00cqevv0yb2ubcsy", canonicalTranslationId: "ct_cmrgfs4nc003l24v01rg3f9bj_bg" },
  { oldTranslationId: "cmrgjps8b00crevv04p3dj7b4", canonicalTranslationId: "ct_cmrgfs4nc003l24v01rg3f9bj_en" },
  { oldTranslationId: "cmrgjpsbt00ctevv01s2cmowc", canonicalTranslationId: "ct_cmrgfs4tc003n24v0o7cot1xv_bg" },
  { oldTranslationId: "cmrgjpsdt00cuevv0b4zp46i6", canonicalTranslationId: "ct_cmrgfs4tc003n24v0o7cot1xv_en" },
  { oldTranslationId: "cmrgjq43r00htevv085k47jur", canonicalTranslationId: "ct_cmrgfs5rc004624v07h3ihx3l_bg" },
  { oldTranslationId: "cmrgjq45l00huevv0ddj0ys2z", canonicalTranslationId: "ct_cmrgfs5rc004624v07h3ihx3l_en" },
  { oldTranslationId: "cmrgjq49700hwevv0dn5d56sm", canonicalTranslationId: "ct_cmrgfs5pp004524v0aayeaa3h_bg" },
  { oldTranslationId: "cmrgjq4ay00hxevv0lj6z33bb", canonicalTranslationId: "ct_cmrgfs5pp004524v0aayeaa3h_en" },
  { oldTranslationId: "cmrgjq4ez00hzevv0br60hoe0", canonicalTranslationId: "ct_cmrgfs5m3004324v08ldoot4s_bg" },
  { oldTranslationId: "cmrgjq4gv00i0evv0gnnu0jis", canonicalTranslationId: "ct_cmrgfs5m3004324v08ldoot4s_en" },
  { oldTranslationId: "cmrgjq4m800i2evv0504hqurz", canonicalTranslationId: "ct_cmrgfs5o3004424v0tnau23dd_bg" },
  { oldTranslationId: "cmrgjq4ob00i3evv0dmsn13bn", canonicalTranslationId: "ct_cmrgfs5o3004424v0tnau23dd_en" },
  { oldTranslationId: "ct_cmrgfrvox000124v0a18yvaux_bg", canonicalTranslationId: "cmrgjoy780002evv02v45pigs" },
  { oldTranslationId: "ct_cmrgfrvox000124v0a18yvaux_en", canonicalTranslationId: "cmrgjoyc60003evv01xbehv4a" },
  { oldTranslationId: "ct_cmrgfrvrb000224v0279cghes_bg", canonicalTranslationId: "cmrgjp0z6000tevv08uxx6aqh" },
  { oldTranslationId: "ct_cmrgfrvrb000224v0279cghes_en", canonicalTranslationId: "cmrgjp10u000uevv0btd7vbfd" },
  { oldTranslationId: "ct_cmrgfrvt0000324v0esln0xtc_bg", canonicalTranslationId: "cmrgjp2l8001kevv09k9llnuh" },
  { oldTranslationId: "ct_cmrgfrvt0000324v0esln0xtc_en", canonicalTranslationId: "cmrgjp2mx001levv05lggfcp8" },
  { oldTranslationId: "ct_cmrgfrvwo000424v01oamhhax_bg", canonicalTranslationId: "cmrgjp3yk002bevv0fsto3coj" },
  { oldTranslationId: "ct_cmrgfrvwo000424v01oamhhax_en", canonicalTranslationId: "cmrgjp40k002cevv0orm3xptr" },
  { oldTranslationId: "ct_cmrgfrvyp000524v09y0cxvyr_bg", canonicalTranslationId: "cmrgjp5fw0032evv0xynj591m" },
  { oldTranslationId: "ct_cmrgfrvyp000524v09y0cxvyr_en", canonicalTranslationId: "cmrgjp5hw0033evv05bxc7ba5" },
  { oldTranslationId: "ct_cmrgfrw1u000624v06fuozdxn_bg", canonicalTranslationId: "cmrgjp6vr003tevv045ysakq1" },
  { oldTranslationId: "ct_cmrgfrw1u000624v06fuozdxn_en", canonicalTranslationId: "cmrgjp6xo003uevv0lioezn28" },
  { oldTranslationId: "ct_cmrgfrw3s000724v0mk05dmkl_bg", canonicalTranslationId: "cmrgjp8ta004tevv0gwe7lqvn" },
  { oldTranslationId: "ct_cmrgfrw3s000724v0mk05dmkl_en", canonicalTranslationId: "cmrgjp8v2004uevv08n8bexef" },
  { oldTranslationId: "ct_cmrgfrw58000824v0jgkjponq_bg", canonicalTranslationId: "cmrgjpaoj005kevv0utqi2l1w" },
  { oldTranslationId: "ct_cmrgfrw58000824v0jgkjponq_en", canonicalTranslationId: "cmrgjpaqj005levv0hu3gvu31" },
  { oldTranslationId: "ct_cmrgfrw73000924v0pb3llpqb_bg", canonicalTranslationId: "cmrgjpdfg006bevv0y11nw97d" },
  { oldTranslationId: "ct_cmrgfrw73000924v0pb3llpqb_en", canonicalTranslationId: "cmrgjpdhf006cevv0uwi9ksvf" },
  { oldTranslationId: "ct_cmrgfrw8q000a24v02d6h7gf4_bg", canonicalTranslationId: "cmrgjpf8e0072evv0ri06b4jz" },
  { oldTranslationId: "ct_cmrgfrw8q000a24v02d6h7gf4_en", canonicalTranslationId: "cmrgjpfab0073evv0y41sjk8g" },
  { oldTranslationId: "ct_cmrgfrwaj000b24v0q6se4on3_bg", canonicalTranslationId: "cmrgjpmda00atevv0ui3efg96" },
  { oldTranslationId: "ct_cmrgfrwaj000b24v0q6se4on3_en", canonicalTranslationId: "cmrgjpmey00auevv0n77jn1lb" },
  { oldTranslationId: "ct_cmrgfrwcv000c24v0vymh3hag_bg", canonicalTranslationId: "cmrgjpor700bkevv0z7jcpac7" },
  { oldTranslationId: "ct_cmrgfrwcv000c24v0vymh3hag_en", canonicalTranslationId: "cmrgjposz00blevv0is5qzeed" },
  { oldTranslationId: "ct_cmrgfrwey000d24v0fj37uc23_bg", canonicalTranslationId: "cmrgjpgo7007tevv00xv1jh4o" },
  { oldTranslationId: "ct_cmrgfrwey000d24v0fj37uc23_en", canonicalTranslationId: "cmrgjpgpy007uevv0g0fr5tfk" },
  { oldTranslationId: "ct_cmrgfrwgs000e24v00ef63xaz_bg", canonicalTranslationId: "cmrgjpi28008kevv0244jcl3j" },
  { oldTranslationId: "ct_cmrgfrwgs000e24v00ef63xaz_en", canonicalTranslationId: "cmrgjpi45008levv04gda7122" },
  { oldTranslationId: "ct_cmrgfrwkf000g24v0pfkfn82v_bg", canonicalTranslationId: "cmrgjprdc00cbevv00vc7yijw" },
  { oldTranslationId: "ct_cmrgfrwkf000g24v0pfkfn82v_en", canonicalTranslationId: "cmrgjprf000ccevv0jkbztpf4" },
  { oldTranslationId: "ct_cmrgfrwps000i24v02gppmu40_bg", canonicalTranslationId: "cmrgjpkwl00a2evv0y0dyaer8" },
  { oldTranslationId: "ct_cmrgfrwps000i24v02gppmu40_en", canonicalTranslationId: "cmrgjpkyb00a3evv0uw4uigdi" },
  { oldTranslationId: "ct_cmrgfrwyt000n24v0yljyem0k_bg", canonicalTranslationId: "cmrgjpubj00dtevv0gmvwdacb" },
  { oldTranslationId: "ct_cmrgfrwyt000n24v0yljyem0k_en", canonicalTranslationId: "cmrgjpudd00duevv0qlgn65mp" },
  { oldTranslationId: "ct_cmrgfrxkw000v24v0idxxl2e6_bg", canonicalTranslationId: "cmrgjp1lm0012evv0yid1xned" },
  { oldTranslationId: "ct_cmrgfrxkw000v24v0idxxl2e6_en", canonicalTranslationId: "cmrgjp1nj0013evv0c1h7qrey" },
  { oldTranslationId: "ct_cmrgfrzc4001f24v0ts8qsody_bg", canonicalTranslationId: "cmrgjp631003eevv03hawlaa3" },
  { oldTranslationId: "ct_cmrgfrzc4001f24v0ts8qsody_en", canonicalTranslationId: "cmrgjp64p003fevv0omz1k9pf" },
  { oldTranslationId: "ct_cmrgfs0jw001r24v0cm9hj28k_bg", canonicalTranslationId: "cmrgjp969004zevv0hzqo49wg" },
  { oldTranslationId: "ct_cmrgfs0jw001r24v0cm9hj28k_en", canonicalTranslationId: "cmrgjp9830050evv0ixs66g4t" },
  { oldTranslationId: "ct_cmrgfs0oe001s24v0s7j0og56_bg", canonicalTranslationId: "cmrgjp9c10052evv06a2xhvlg" },
  { oldTranslationId: "ct_cmrgfs0oe001s24v0s7j0og56_en", canonicalTranslationId: "cmrgjp9dq0053evv0p47bwxav" },
  { oldTranslationId: "ct_cmrgfs2yi002p24v08wik29ff_bg", canonicalTranslationId: "cmrgjpp1d00bnevv0a3185y6a" },
  { oldTranslationId: "ct_cmrgfs2yi002p24v08wik29ff_en", canonicalTranslationId: "cmrgjpp5u00boevv07sk0oyd1" },
  { oldTranslationId: "ct_cmrgfs30c002q24v06vrk2p0o_bg", canonicalTranslationId: "cmrgjppao00bqevv0vz1jle1e" },
  { oldTranslationId: "ct_cmrgfs30c002q24v06vrk2p0o_en", canonicalTranslationId: "cmrgjppfq00brevv01eclugkx" },
  { oldTranslationId: "ct_cmrgfs326002r24v00u4qo1dr_bg", canonicalTranslationId: "cmrgjpplv00btevv0e64rc3j3" },
  { oldTranslationId: "ct_cmrgfs326002r24v00u4qo1dr_en", canonicalTranslationId: "cmrgjpppy00buevv0ox49yn79" },
  { oldTranslationId: "ct_cmrgfs38i002u24v0e5tefuyt_bg", canonicalTranslationId: "cmrgjpqnk00c2evv0hm8fok7p" },
  { oldTranslationId: "ct_cmrgfs38i002u24v0e5tefuyt_en", canonicalTranslationId: "cmrgjpqs300c3evv08seygbc9" },
  { oldTranslationId: "ct_cmrgfs3ce002w24v0mw3p45ib_bg", canonicalTranslationId: "cmrgjpgtp007wevv0q5ko63lc" },
  { oldTranslationId: "ct_cmrgfs3ce002w24v0mw3p45ib_en", canonicalTranslationId: "cmrgjpgvf007xevv0wv8buxsn" },
  { oldTranslationId: "ct_cmrgfs3e7002x24v01bsv2e6x_bg", canonicalTranslationId: "cmrgjpgyr007zevv0glbu8j5r" },
  { oldTranslationId: "ct_cmrgfs3e7002x24v01bsv2e6x_en", canonicalTranslationId: "cmrgjph0h0080evv0bv8vlnz9" },
  { oldTranslationId: "ct_cmrgfs3ge002y24v0ps5pe3au_bg", canonicalTranslationId: "cmrgjph5k0082evv0t9456e1g" },
  { oldTranslationId: "ct_cmrgfs3ge002y24v0ps5pe3au_en", canonicalTranslationId: "cmrgjph7f0083evv0ld44x7pz" },
  { oldTranslationId: "ct_cmrgfs3tc003524v0uh89f91y_bg", canonicalTranslationId: "cmrgjpiit008tevv0dz5t4qmd" },
  { oldTranslationId: "ct_cmrgfs3tc003524v0uh89f91y_en", canonicalTranslationId: "cmrgjpiki008uevv07tw8735w" },
  { oldTranslationId: "ct_cmrgfs3x0003724v0rfr7kos0_bg", canonicalTranslationId: "ct_cmrgfs5m3004324v08ldoot4s_bg" },
  { oldTranslationId: "ct_cmrgfs3x0003724v0rfr7kos0_en", canonicalTranslationId: "ct_cmrgfs5m3004324v08ldoot4s_en" },
  { oldTranslationId: "ct_cmrgfs4k1003j24v0u4xg2qgv_bg", canonicalTranslationId: "cmrgjprvz00ckevv097yn3vn5" },
  { oldTranslationId: "ct_cmrgfs4k1003j24v0u4xg2qgv_en", canonicalTranslationId: "cmrgjprxm00clevv0j3cb90i7" },
  { oldTranslationId: "ct_cmrgfs4p9003m24v0d2ia5h36_bg", canonicalTranslationId: "cmrgjp7jm0045evv02uft3bul" },
  { oldTranslationId: "ct_cmrgfs4p9003m24v0d2ia5h36_en", canonicalTranslationId: "cmrgjp7lg0046evv0zop7xrya" },
  { oldTranslationId: "ct_cmrgfs5au003x24v0udq4doo2_bg", canonicalTranslationId: "cmrgjples00abevv0ow6fuzea" },
  { oldTranslationId: "ct_cmrgfs5au003x24v0udq4doo2_en", canonicalTranslationId: "cmrgjplgp00acevv080c2gpoq" },
];

const MANUAL_TRANSLATION_RESOLUTION_KEYS = new Set(
  MANUAL_TRANSLATION_RESOLUTIONS.map(
    (r) => `${r.oldTranslationId}->${r.canonicalTranslationId}`
  )
);

type ValidationResult = {
  orphanFkCount: number;
  duplicateNormalizedBgCount: number;
  duplicateNormalizedEnCount: number;
  duplicateConfusableCount: number;
  orphanTranslationCount: number;
  orphanParentCount: number;
  orphanJoinCount: number;
  mappedOldStillActiveCount: number;
  missingCanonicalCount: number;
  fkCountsInvariant: boolean;
  categoryCountsMatchExpectation: boolean;
  translationsIntact: boolean;
  parentHierarchyIntact: boolean;
  companyCategoryRelationsIntact: boolean;
};

type MigrationReport = {
  dryRun: boolean;
  startedAt: string;
  finishedAt?: string;
  mappingCount: number;
  canonicalMapping: CategoryCanonicalMapping[];
  updatedFkRows: Array<{ table: string; column: string; rows: number }>;
  updatedFkRowsTotal: number;
  translationMerges: number;
  archivedCategoryIds: string[];
  unicodeFixes: Array<{ categoryId: string; locale: string; before: string; after: string }>;
  translationConflicts: TranslationConflict[];
  preflight: {
    ok: boolean;
    errors: string[];
    fkColumnsDiscovered: number;
    categoryCountBefore: number;
    activeCategoryCountBefore: number;
    categoryTranslationCountBefore: number;
    mappedOldIdsCount: number;
    mappedCanonicalIdsCount: number;
  };
  validation: ValidationResult;
  rollback: {
    triggered: boolean;
    reason?: string;
  };
};

type PreflightSnapshot = {
  fkColumns: FkColumn[];
  fkCountsBefore: Map<string, number>;
  categoryCountBefore: number;
  activeCategoryCountBefore: number;
  categoryTranslationCountBefore: number;
  mappedOldIds: string[];
  mappedCanonicalIds: string[];
  mappedOldActiveCountBefore: number;
};

class UnionFind {
  private parent = new Map<string, string>();

  add(x: string) {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
    }
  }

  find(x: string): string {
    const p = this.parent.get(x);
    if (!p) {
      this.parent.set(x, x);
      return x;
    }
    if (p === x) {
      return x;
    }
    const root = this.find(p);
    this.parent.set(x, root);
    return root;
  }

  union(a: string, b: string) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) {
      this.parent.set(rb, ra);
    }
  }

  groups(): Map<string, string[]> {
    const out = new Map<string, string[]>();
    for (const key of this.parent.keys()) {
      const r = this.find(key);
      out.set(r, [...(out.get(r) ?? []), key]);
    }
    return out;
  }
}

function quoteIdent(input: string): string {
  if (!/^[A-Za-z0-9_]+$/.test(input)) {
    throw new Error(`Unsafe SQL identifier: ${input}`);
  }
  return `"${input}"`;
}

function fkKey(fk: FkColumn): string {
  return `${fk.table}.${fk.column}`;
}

function slugScore(slug: string): number {
  const ascii = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? 1 : 0;
  const englishLike = /(solar|drain|office|rail|fencing|alarm|vapor|pool|window)/.test(slug) ? 1 : 0;
  return ascii + englishLike;
}

function getPreferenceScore(cat: CategoryRecord, bgKey: string, enKey: string): number {
  let best = 0;
  for (const rule of CANONICAL_SLUG_PREFERENCES) {
    const matchesLocale =
      rule.locale === "either" ||
      (rule.locale === "bg" && rule.normalizedKey === bgKey) ||
      (rule.locale === "en" && rule.normalizedKey === enKey);

    if (!matchesLocale) {
      continue;
    }

    if (cat.slug === rule.preferredCanonicalSlug) {
      best = Math.max(best, (rule.priority ?? 10));
    }
  }
  return best;
}

async function discoverCategoryFkColumns(client: typeof prisma | Prisma.TransactionClient): Promise<FkColumn[]> {
  const rows = await client.$queryRawUnsafe<Array<{ table_name: string; column_name: string }>>(`
    SELECT tc.table_name AS table_name, kcu.column_name AS column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
     AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      AND ccu.table_name = 'Category'
      AND ccu.column_name = 'id'
    ORDER BY tc.table_name, kcu.column_name
  `);

  return rows.map((r) => ({ table: r.table_name, column: r.column_name }));
}

async function getFkNonNullCounts(
  client: typeof prisma | Prisma.TransactionClient,
  fkColumns: FkColumn[]
): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  for (const fk of fkColumns) {
    const table = quoteIdent(fk.table);
    const column = quoteIdent(fk.column);
    const rows = await client.$queryRawUnsafe<Array<{ cnt: bigint }>>(
      `SELECT COUNT(*)::bigint AS cnt FROM ${table} WHERE ${column} IS NOT NULL`
    );
    out.set(fkKey(fk), Number(rows[0]?.cnt ?? 0));
  }
  return out;
}

async function getReferenceCountsByCategory(
  client: typeof prisma | Prisma.TransactionClient,
  fkColumns: FkColumn[]
): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  for (const fk of fkColumns) {
    const table = quoteIdent(fk.table);
    const column = quoteIdent(fk.column);
    const rows = await client.$queryRawUnsafe<Array<{ category_id: string; cnt: bigint }>>(
      `SELECT ${column} AS category_id, COUNT(*)::bigint AS cnt FROM ${table} WHERE ${column} IS NOT NULL GROUP BY ${column}`
    );
    for (const row of rows) {
      out.set(row.category_id, (out.get(row.category_id) ?? 0) + Number(row.cnt));
    }
  }
  return out;
}

async function getOrphanFkTargetsCount(
  client: typeof prisma | Prisma.TransactionClient,
  fkColumns: FkColumn[]
): Promise<number> {
  let total = 0;
  for (const fk of fkColumns) {
    const table = quoteIdent(fk.table);
    const column = quoteIdent(fk.column);
    const rows = await client.$queryRawUnsafe<Array<{ cnt: bigint }>>(`
      SELECT COUNT(*)::bigint AS cnt
      FROM ${table} t
      LEFT JOIN "Category" c ON c."id" = t.${column}
      WHERE t.${column} IS NOT NULL AND c."id" IS NULL
    `);
    total += Number(rows[0]?.cnt ?? 0);
  }
  return total;
}

function getTranslationName(translations: Array<{ locale: string; name: string }>, locale: "bg" | "en"): string {
  return translations.find((t) => t.locale === locale)?.name ?? "";
}

async function loadActiveCategories(client: typeof prisma | Prisma.TransactionClient): Promise<CategoryRecord[]> {
  const categories = await client.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      slug: true,
      parentId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      translations: {
        where: { locale: { in: ["bg", "en"] } },
        select: { locale: true, name: true },
      },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    parentId: c.parentId,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    bgName: getTranslationName(c.translations, "bg"),
    enName: getTranslationName(c.translations, "en"),
  }));
}

function buildDynamicCanonicalMapping(
  categories: CategoryRecord[],
  refCounts: Map<string, number>,
  categoryIdSet: Set<string>
): CategoryCanonicalMapping[] {
  const byBg = new Map<string, string[]>();
  const byEn = new Map<string, string[]>();
  const byConfusable = new Map<string, string[]>();
  const byId = new Map(categories.map((c) => [c.id, c]));

  for (const c of categories) {
    const bgKey = normalizedComparableKey(c.bgName);
    const enKey = normalizedComparableKey(c.enName);

    byBg.set(bgKey, [...(byBg.get(bgKey) ?? []), c.id]);
    byEn.set(enKey, [...(byEn.get(enKey) ?? []), c.id]);

    const bgConf = normalizeCategoryText(c.bgName, { foldConfusables: true, applyKnownBgFixes: true }).toLowerCase();
    byConfusable.set(bgConf, [...(byConfusable.get(bgConf) ?? []), c.id]);
  }

  const uf = new UnionFind();
  for (const c of categories) {
    uf.add(c.id);
  }

  const connectGroup = (group: string[]) => {
    if (group.length <= 1) return;
    const [first, ...rest] = group;
    for (const id of rest) uf.union(first, id);
  };

  for (const ids of byBg.values()) connectGroup(ids);
  for (const ids of byEn.values()) connectGroup(ids);
  for (const ids of byConfusable.values()) connectGroup(ids);

  const groups = [...uf.groups().values()].filter((ids) => ids.length > 1);
  const mapping: CategoryCanonicalMapping[] = [];

  for (const ids of groups) {
    const members = ids.map((id) => byId.get(id)).filter(Boolean) as CategoryRecord[];

    const bgKey = normalizedComparableKey(members[0]?.bgName ?? "");
    const enKey = normalizedComparableKey(members[0]?.enName ?? "");

    const scored = [...members].sort((a, b) => {
      const prefA = getPreferenceScore(a, bgKey, enKey);
      const prefB = getPreferenceScore(b, bgKey, enKey);
      if (prefB !== prefA) return prefB - prefA;

      const refA = refCounts.get(a.id) ?? 0;
      const refB = refCounts.get(b.id) ?? 0;
      if (refB !== refA) return refB - refA;

      const parentValidA = a.parentId == null || categoryIdSet.has(a.parentId);
      const parentValidB = b.parentId == null || categoryIdSet.has(b.parentId);
      if (Number(parentValidB) !== Number(parentValidA)) return Number(parentValidB) - Number(parentValidA);

      const slugA = slugScore(a.slug);
      const slugB = slugScore(b.slug);
      if (slugB !== slugA) return slugB - slugA;

      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    const canonical = scored[0];
    for (const duplicate of scored.slice(1)) {
      if (duplicate.id === canonical.id) continue;
      mapping.push({
        oldCategoryId: duplicate.id,
        canonicalCategoryId: canonical.id,
        reason: `dynamic-group:${bgKey || enKey || "mixed"}`,
      });
    }
  }

  return mapping.sort((a, b) => a.oldCategoryId.localeCompare(b.oldCategoryId));
}

async function runPreflightValidation(
  client: typeof prisma,
  mapping: CategoryCanonicalMapping[],
  categories: CategoryRecord[],
  fkColumns: FkColumn[],
  fkCountsBefore: Map<string, number>
): Promise<{ errors: string[]; snapshot: PreflightSnapshot }> {
  const errors: string[] = [];

  const mappedOldIds = [...new Set(mapping.map((m) => m.oldCategoryId))];
  const mappedCanonicalIds = [...new Set(mapping.map((m) => m.canonicalCategoryId))];

  const byId = new Map(categories.map((c) => [c.id, c]));

  for (const item of mapping) {
    if (item.oldCategoryId === item.canonicalCategoryId) {
      errors.push(`Invalid self mapping: ${item.oldCategoryId}`);
    }
  }

  for (const oldId of mappedOldIds) {
    if (!byId.has(oldId)) {
      errors.push(`Missing old category in active dataset: ${oldId}`);
    }
  }

  for (const canonicalId of mappedCanonicalIds) {
    const c = byId.get(canonicalId);
    if (!c) {
      errors.push(`Missing canonical category in active dataset: ${canonicalId}`);
      continue;
    }
    if (!c.isActive) {
      errors.push(`Canonical category is inactive: ${canonicalId}`);
    }
  }

  const translationCheck = await client.category.findMany({
    where: { id: { in: [...new Set([...mappedOldIds, ...mappedCanonicalIds])] } },
    select: {
      id: true,
      translations: {
        where: { locale: { in: ["bg", "en"] } },
        select: { locale: true },
      },
    },
  });

  for (const row of translationCheck) {
    const locales = new Set(row.translations.map((t) => t.locale));
    if (!locales.has("bg") || !locales.has("en")) {
      errors.push(`Missing required translations for category ${row.id}`);
    }
  }

  const orphanParentRows = await client.$queryRawUnsafe<Array<{ cnt: bigint }>>(`
    SELECT COUNT(*)::bigint AS cnt
    FROM "Category" c
    WHERE c."parentId" IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM "Category" p WHERE p."id" = c."parentId")
  `);
  if (Number(orphanParentRows[0]?.cnt ?? 0) > 0) {
    errors.push(`Invalid parent hierarchy detected before migration.`);
  }

  const orphanFkTargetsCount = await getOrphanFkTargetsCount(client, fkColumns);
  if (orphanFkTargetsCount > 0) {
    errors.push(`Orphan FK targets exist before migration: ${orphanFkTargetsCount}`);
  }

  const categoryCountBefore = await client.category.count();
  const activeCategoryCountBefore = await client.category.count({ where: { isActive: true } });
  const categoryTranslationCountBefore = await client.categoryTranslation.count();
  const mappedOldActiveCountBefore = await client.category.count({
    where: { id: { in: mappedOldIds }, isActive: true },
  });

  return {
    errors,
    snapshot: {
      fkColumns,
      fkCountsBefore,
      categoryCountBefore,
      activeCategoryCountBefore,
      categoryTranslationCountBefore,
      mappedOldIds,
      mappedCanonicalIds,
      mappedOldActiveCountBefore,
    },
  };
}

async function mergeTranslationsSafely(
  tx: Prisma.TransactionClient,
  oldCategoryId: string,
  canonicalCategoryId: string,
  conflicts: TranslationConflict[]
): Promise<number> {
  let mergeCount = 0;
  const oldRows = await tx.categoryTranslation.findMany({
    where: { categoryId: oldCategoryId },
    orderBy: { createdAt: "asc" },
  });

  for (const oldRow of oldRows) {
    const canonicalRow = await tx.categoryTranslation.findFirst({
      where: {
        categoryId: canonicalCategoryId,
        locale: oldRow.locale,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!canonicalRow) {
      await tx.categoryTranslation.update({
        where: { id: oldRow.id },
        data: { categoryId: canonicalCategoryId },
      });
      mergeCount += 1;
      continue;
    }

    const same =
      canonicalRow.name === oldRow.name &&
      canonicalRow.description === oldRow.description &&
      canonicalRow.seoSlug === oldRow.seoSlug &&
      canonicalRow.metaTitle === oldRow.metaTitle &&
      canonicalRow.metaDescription === oldRow.metaDescription;

    if (!same) {
      const manualResolutionKey = `${oldRow.id}->${canonicalRow.id}`;
      if (MANUAL_TRANSLATION_RESOLUTION_KEYS.has(manualResolutionKey)) {
        await tx.categoryTranslation.delete({ where: { id: oldRow.id } });
        mergeCount += 1;
        continue;
      }

      conflicts.push({
        oldCategoryId,
        canonicalCategoryId,
        locale: oldRow.locale,
        oldTranslationId: oldRow.id,
        canonicalTranslationId: canonicalRow.id,
        oldName: oldRow.name,
        canonicalName: canonicalRow.name,
        oldSeoSlug: oldRow.seoSlug,
        canonicalSeoSlug: canonicalRow.seoSlug,
      });
      continue;
    }

    await tx.categoryTranslation.delete({ where: { id: oldRow.id } });
    mergeCount += 1;
  }

  return mergeCount;
}

async function normalizeUnicode(tx: Prisma.TransactionClient, fixes: MigrationReport["unicodeFixes"]) {
  const categories = await tx.category.findMany({
    select: {
      id: true,
      name: true,
      translations: {
        select: {
          id: true,
          locale: true,
          name: true,
          description: true,
          metaTitle: true,
          metaDescription: true,
        },
      },
    },
  });

  for (const category of categories) {
    const normalizedCategoryName = normalizeCategoryText(category.name, {
      foldConfusables: false,
      applyKnownBgFixes: true,
    });

    if (normalizedCategoryName !== category.name) {
      await tx.category.update({
        where: { id: category.id },
        data: { name: normalizeToNfc(normalizedCategoryName) },
      });
    }

    for (const tr of category.translations) {
      const applyBgFixes = tr.locale === "bg";
      const newName = normalizeCategoryText(tr.name, { foldConfusables: false, applyKnownBgFixes: applyBgFixes });
      const newDescription = normalizeCategoryText(tr.description, { foldConfusables: false, applyKnownBgFixes: applyBgFixes });
      const newMetaTitle = normalizeCategoryText(tr.metaTitle, { foldConfusables: false, applyKnownBgFixes: applyBgFixes });
      const newMetaDescription = normalizeCategoryText(tr.metaDescription, { foldConfusables: false, applyKnownBgFixes: applyBgFixes });

      if (
        newName !== tr.name ||
        newDescription !== tr.description ||
        newMetaTitle !== tr.metaTitle ||
        newMetaDescription !== tr.metaDescription
      ) {
        fixes.push({
          categoryId: category.id,
          locale: tr.locale,
          before: tr.name,
          after: newName,
        });

        await tx.categoryTranslation.update({
          where: { id: tr.id },
          data: {
            name: normalizeToNfc(newName),
            description: normalizeToNfc(newDescription),
            metaTitle: normalizeToNfc(newMetaTitle),
            metaDescription: normalizeToNfc(newMetaDescription),
          },
        });
      }
    }
  }
}

async function runValidation(
  client: Prisma.TransactionClient,
  snapshot: PreflightSnapshot,
  mapping: CategoryCanonicalMapping[]
): Promise<ValidationResult> {
  const activeCategories = await client.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      translations: {
        where: { locale: { in: ["bg", "en"] } },
        select: { locale: true, name: true },
      },
    },
  });

  const byBg = new Map<string, number>();
  const byEn = new Map<string, number>();
  const byConfCategoryIds = new Map<string, Set<string>>();

  for (const cat of activeCategories) {
    const bgName = getTranslationName(cat.translations, "bg");
    const enName = getTranslationName(cat.translations, "en");

    if (bgName) {
      const bgKey = normalizedComparableKey(bgName);
      byBg.set(bgKey, (byBg.get(bgKey) ?? 0) + 1);

      const conf = normalizeCategoryText(bgName, { foldConfusables: true, applyKnownBgFixes: true }).toLowerCase();
      byConfCategoryIds.set(conf, new Set([...(byConfCategoryIds.get(conf) ?? []), cat.id]));
    }

    if (enName) {
      const enKey = normalizedComparableKey(enName);
      byEn.set(enKey, (byEn.get(enKey) ?? 0) + 1);

      const conf = normalizeCategoryText(enName, { foldConfusables: true, applyKnownBgFixes: false }).toLowerCase();
      byConfCategoryIds.set(conf, new Set([...(byConfCategoryIds.get(conf) ?? []), cat.id]));
    }
  }

  const duplicateNormalizedBgCount = [...byBg.values()].filter((n) => n > 1).length;
  const duplicateNormalizedEnCount = [...byEn.values()].filter((n) => n > 1).length;
  const duplicateConfusableCount = [...byConfCategoryIds.values()].filter((ids) => ids.size > 1).length;

  const orphanTranslationRows = await client.$queryRawUnsafe<Array<{ cnt: bigint }>>(`
    SELECT COUNT(*)::bigint AS cnt
    FROM "CategoryTranslation" ct
    LEFT JOIN "Category" c ON c."id" = ct."categoryId"
    WHERE c."id" IS NULL
  `);

  const orphanParentRows = await client.$queryRawUnsafe<Array<{ cnt: bigint }>>(`
    SELECT COUNT(*)::bigint AS cnt
    FROM "Category" c
    WHERE c."parentId" IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM "Category" p WHERE p."id" = c."parentId")
  `);

  const orphanJoinRows = await client.$queryRawUnsafe<Array<{ cnt: bigint }>>(`
    SELECT COUNT(*)::bigint AS cnt
    FROM "_CategoryToCompanyApplication" j
    LEFT JOIN "Category" c ON c."id" = j."A"
    LEFT JOIN "CompanyApplication" ca ON ca."id" = j."B"
    WHERE c."id" IS NULL OR ca."id" IS NULL
  `);

  const mappedOldIds = [...new Set(mapping.map((m) => m.oldCategoryId))];
  const mappedCanonicalIds = [...new Set(mapping.map((m) => m.canonicalCategoryId))];

  const mappedOldStillActiveCount = await client.category.count({
    where: { id: { in: mappedOldIds }, isActive: true },
  });

  const canonicalFound = await client.category.count({
    where: { id: { in: mappedCanonicalIds } },
  });
  const missingCanonicalCount = mappedCanonicalIds.length - canonicalFound;

  const fkCountsAfter = await getFkNonNullCounts(client, snapshot.fkColumns);
  const categoryTranslationCountAfter = await client.categoryTranslation.count();
  const deletedCategoryTranslationCount =
    snapshot.categoryTranslationCountBefore - categoryTranslationCountAfter;

  let fkCountsInvariant = true;
  for (const [key, before] of snapshot.fkCountsBefore.entries()) {
    const after = fkCountsAfter.get(key) ?? 0;
    const expectedAfter =
      key === "CategoryTranslation.categoryId"
        ? before - deletedCategoryTranslationCount
        : before;

    if (expectedAfter !== after) {
      fkCountsInvariant = false;
    }
  }

  const categoryCountAfter = await client.category.count();
  const activeCountAfter = await client.category.count({ where: { isActive: true } });
  const categoryCountsMatchExpectation =
    categoryCountAfter === snapshot.categoryCountBefore &&
    activeCountAfter ===
      snapshot.activeCategoryCountBefore - snapshot.mappedOldActiveCountBefore;

  return {
    orphanFkCount: Number(orphanParentRows[0]?.cnt ?? 0),
    duplicateNormalizedBgCount,
    duplicateNormalizedEnCount,
    duplicateConfusableCount,
    orphanTranslationCount: Number(orphanTranslationRows[0]?.cnt ?? 0),
    orphanParentCount: Number(orphanParentRows[0]?.cnt ?? 0),
    orphanJoinCount: Number(orphanJoinRows[0]?.cnt ?? 0),
    mappedOldStillActiveCount,
    missingCanonicalCount,
    fkCountsInvariant,
    categoryCountsMatchExpectation,
    translationsIntact: Number(orphanTranslationRows[0]?.cnt ?? 0) === 0,
    parentHierarchyIntact: Number(orphanParentRows[0]?.cnt ?? 0) === 0,
    companyCategoryRelationsIntact: Number(orphanJoinRows[0]?.cnt ?? 0) === 0,
  };
}

async function main() {
  const dryRun = process.env.DRY_RUN === "true";

  const report: MigrationReport = {
    dryRun,
    startedAt: new Date().toISOString(),
    mappingCount: 0,
    canonicalMapping: [],
    updatedFkRows: [],
    updatedFkRowsTotal: 0,
    translationMerges: 0,
    archivedCategoryIds: [],
    unicodeFixes: [],
    translationConflicts: [],
    preflight: {
      ok: false,
      errors: [],
      fkColumnsDiscovered: 0,
      categoryCountBefore: 0,
      activeCategoryCountBefore: 0,
      categoryTranslationCountBefore: 0,
      mappedOldIdsCount: 0,
      mappedCanonicalIdsCount: 0,
    },
    validation: {
      orphanFkCount: 0,
      duplicateNormalizedBgCount: 0,
      duplicateNormalizedEnCount: 0,
      duplicateConfusableCount: 0,
      orphanTranslationCount: 0,
      orphanParentCount: 0,
      orphanJoinCount: 0,
      mappedOldStillActiveCount: 0,
      missingCanonicalCount: 0,
      fkCountsInvariant: false,
      categoryCountsMatchExpectation: false,
      translationsIntact: false,
      parentHierarchyIntact: false,
      companyCategoryRelationsIntact: false,
    },
    rollback: {
      triggered: false,
    },
  };

  const fkColumns = await discoverCategoryFkColumns(prisma);
  const fkCountsBefore = await getFkNonNullCounts(prisma, fkColumns);
  const categories = await loadActiveCategories(prisma);
  const categoryIdSet = new Set(categories.map((c) => c.id));
  const refCounts = await getReferenceCountsByCategory(prisma, fkColumns);
  const mapping = buildDynamicCanonicalMapping(categories, refCounts, categoryIdSet);

  report.mappingCount = mapping.length;
  report.canonicalMapping = mapping;

  const preflight = await runPreflightValidation(prisma, mapping, categories, fkColumns, fkCountsBefore);
  report.preflight = {
    ok: preflight.errors.length === 0,
    errors: preflight.errors,
    fkColumnsDiscovered: preflight.snapshot.fkColumns.length,
    categoryCountBefore: preflight.snapshot.categoryCountBefore,
    activeCategoryCountBefore: preflight.snapshot.activeCategoryCountBefore,
    categoryTranslationCountBefore: preflight.snapshot.categoryTranslationCountBefore,
    mappedOldIdsCount: preflight.snapshot.mappedOldIds.length,
    mappedCanonicalIdsCount: preflight.snapshot.mappedCanonicalIds.length,
  };

  if (preflight.errors.length > 0) {
    report.rollback.triggered = true;
    report.rollback.reason = "Pre-flight validation failed before transaction.";
    report.finishedAt = new Date().toISOString();
    console.log(JSON.stringify(report, null, 2));
    await prisma.$disconnect();
    process.exitCode = 1;
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1) Translation-safe merge behavior (must happen before any CategoryTranslation FK repoint).
      for (const item of mapping) {
        report.translationMerges += await mergeTranslationsSafely(
          tx,
          item.oldCategoryId,
          item.canonicalCategoryId,
          report.translationConflicts
        );
      }

      // 2) Repoint non-translation FK references.
      for (const fk of preflight.snapshot.fkColumns) {
        if (fk.table === "CategoryTranslation" && fk.column === "categoryId") {
          continue;
        }

        const table = quoteIdent(fk.table);
        const column = quoteIdent(fk.column);

        for (const item of mapping) {
          const updated = await tx.$executeRawUnsafe(
            `UPDATE ${table} SET ${column} = $1 WHERE ${column} = $2`,
            item.canonicalCategoryId,
            item.oldCategoryId
          );
          if (updated > 0) {
            report.updatedFkRows.push({ table: fk.table, column: fk.column, rows: Number(updated) });
            report.updatedFkRowsTotal += Number(updated);
          }
        }
      }

      // 3) Unicode normalization.
      await normalizeUnicode(tx, report.unicodeFixes);

      // 4) Archive duplicates.
      const oldIds = [...new Set(mapping.map((m) => m.oldCategoryId))];
      if (CANONICAL_ARCHIVE_STRATEGY === "set-inactive" && oldIds.length > 0) {
        await tx.category.updateMany({
          where: { id: { in: oldIds } },
          data: { isActive: false },
        });
      }
      report.archivedCategoryIds = oldIds;

      // 5) Validation inside transaction.
      report.validation = await runValidation(tx, preflight.snapshot, mapping);

      const failed =
        report.validation.orphanFkCount > 0 ||
        report.validation.duplicateNormalizedBgCount > 0 ||
        report.validation.duplicateNormalizedEnCount > 0 ||
        report.validation.duplicateConfusableCount > 0 ||
        report.validation.orphanTranslationCount > 0 ||
        report.validation.orphanParentCount > 0 ||
        report.validation.orphanJoinCount > 0 ||
        report.validation.mappedOldStillActiveCount > 0 ||
        report.validation.missingCanonicalCount > 0 ||
        !report.validation.fkCountsInvariant ||
        !report.validation.categoryCountsMatchExpectation ||
        report.translationConflicts.length > 0;

      if (failed) {
        report.rollback.triggered = true;
        report.rollback.reason = "Validation failure inside transaction.";
        throw new Error(report.rollback.reason);
      }

      if (dryRun) {
        report.rollback.triggered = true;
        report.rollback.reason = "DRY_RUN requested rollback.";
        throw new Error(report.rollback.reason);
      }
    }, {
      maxWait: 20_000,
      timeout: 180_000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!report.rollback.triggered) {
      report.rollback.triggered = true;
      report.rollback.reason = message;
    }

    if (!(dryRun && report.rollback.reason === "DRY_RUN requested rollback.")) {
      report.finishedAt = new Date().toISOString();
      console.log(JSON.stringify(report, null, 2));
      await prisma.$disconnect();
      process.exitCode = 1;
      return;
    }
  }

  report.finishedAt = new Date().toISOString();
  console.log(JSON.stringify(report, null, 2));
  await prisma.$disconnect();
}

void main();
