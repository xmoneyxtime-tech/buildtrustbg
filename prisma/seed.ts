import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

type TaxonomyNode = {
  slug: string;
  icon: string;
  featured?: boolean;
  popular?: boolean;
  premiumOnly?: boolean;
  searchKeywords?: string[];
  synonyms?: string[];
  bg: {
    name: string;
    description: string;
  };
  en: {
    name: string;
    description: string;
  };
  children?: TaxonomyNode[];
};

function metaTitle(name: string): string {
  return `${name} | BuildTrustBG`;
}

function metaDescription(description: string): string {
  return description.length > 155 ? `${description.slice(0, 152)}...` : description;
}

function node(
  slug: string,
  icon: string,
  bgName: string,
  enName: string,
  bgDescription: string,
  enDescription: string,
  options?: {
    featured?: boolean;
    popular?: boolean;
    premiumOnly?: boolean;
    searchKeywords?: string[];
    synonyms?: string[];
    children?: TaxonomyNode[];
  }
): TaxonomyNode {
  return {
    slug,
    icon,
    bg: { name: bgName, description: bgDescription },
    en: { name: enName, description: enDescription },
    featured: options?.featured,
    popular: options?.popular,
    premiumOnly: options?.premiumOnly,
    searchKeywords: options?.searchKeywords,
    synonyms: options?.synonyms,
    children: options?.children,
  };
}

const TAXONOMY: TaxonomyNode[] = [
  node(
    "construction",
    "🏗️",
    "Строителство",
    "Construction",
    "Пълно строителство на жилищни, обществени и индустриални сгради.",
    "Full construction for residential, commercial and industrial buildings.",
    {
      featured: true,
      popular: true,
      searchKeywords: ["строеж", "construction", "изграждане"],
      children: [
        node("rough-construction", "🧱", "Груб строеж", "Rough Construction", "Груб строеж и конструктивни работи.", "Structural frame and rough construction services."),
        node("formwork", "🪵", "Кофраж", "Formwork", "Кофражни системи за плочи, колони и греди.", "Formwork systems for slabs, columns and beams."),
        node("rebar", "🦾", "Арматура", "Rebar", "Арматурни заготовки, монтаж и връзване.", "Rebar detailing, fabrication and installation."),
        node("concrete", "🧪", "Бетон", "Concrete", "Доставка, полагане и обработка на бетон.", "Concrete supply, pouring and finishing."),
        node("masonry", "🧱", "Зидария", "Masonry", "Тухлени и блокови зидове за всички типове сгради.", "Brick and block masonry for all building types."),
        node("demolition", "💥", "Събаряне", "Demolition", "Контролирано събаряне и разчистване на терени.", "Controlled demolition and site clearance."),
        node("excavation", "⛏️", "Изкопни работи", "Excavation", "Изкопи, насипи и подготовка на основи.", "Excavation, backfilling and foundation prep."),
        node("foundation-work", "🏛️", "Основи", "Foundations", "Фундаменти, ивични и плочни основи.", "Strip and slab foundations for new builds."),
      ],
    }
  ),
  node(
    "renovation",
    "🔨",
    "Ремонти",
    "Renovation",
    "Основни и козметични ремонти на имоти.",
    "Major and cosmetic renovation services.",
    {
      popular: true,
      searchKeywords: ["ремонт", "renovation", "обновяване"],
      children: [
        node("apartment-renovation", "🏢", "Ремонт на апартамент", "Apartment Renovation", "Цялостен ремонт на апартаменти.", "End-to-end apartment renovation."),
        node("house-renovation", "🏠", "Ремонт на къща", "House Renovation", "Вътрешен и външен ремонт на къщи.", "Interior and exterior house renovation."),
        node("office-renovation", "💼", "Ремонт на офис", "Office Renovation", "Ремонт и преустройство на офиси.", "Office refurbishments and fit-outs."),
        node("bathroom-renovation", "🚿", "Ремонт на баня", "Bathroom Renovation", "Пълен ремонт на бани и мокри помещения.", "Complete bathroom renovation services."),
        node("kitchen-renovation", "🍽️", "Ремонт на кухня", "Kitchen Renovation", "Модернизация и преустройство на кухни.", "Kitchen modernization and remodelling."),
        node("turnkey-renovation", "🗝️", "Ремонт до ключ", "Turnkey Renovation", "Проектиране и изпълнение до ключ.", "Turnkey renovation from design to handover."),
        node("post-damage-renovation", "🆘", "Ремонт след щети", "Post-damage Renovation", "Възстановяване след пожар, наводнение и аварии.", "Restoration after fire, flood and accidents."),
        node("commercial-refit", "🏬", "Преустройство на търговски обекти", "Commercial Refit", "Преустройство на магазини и заведения.", "Commercial space refits for retail and hospitality."),
      ],
    }
  ),
  node(
    "roofing",
    "🏠",
    "Покриви",
    "Roofing",
    "Изграждане, ремонт и поддръжка на покривни системи.",
    "Roofing system installation, repair and maintenance.",
    {
      popular: true,
      children: [
        node("new-roofs", "🧱", "Нови покриви", "New Roofs", "Изграждане на нови покривни конструкции.", "New roof structure construction."),
        node("roof-repair", "🔧", "Ремонт на покрив", "Roof Repair", "Ремонт на течове и увредени участъци.", "Leak repairs and damaged section replacement."),
        node("roof-waterproofing", "💧", "Хидроизолация на покрив", "Roof Waterproofing", "Мембрани и покривни хидроизолации.", "Roof membranes and waterproofing systems."),
        node("tile-roofs", "🧩", "Керемидени покриви", "Tile Roofs", "Монтаж и ремонт на керемидени покриви.", "Tile roof installation and repairs."),
        node("metal-roofs", "🪙", "Метални покриви", "Metal Roofs", "Ламаринени и метални покривни системи.", "Sheet metal and standing seam roofing."),
        node("gutters", "🌧️", "Улуци и водосточни системи", "Gutters and Drainage", "Монтаж и подмяна на улуци.", "Gutter and rainwater drainage systems."),
        node("chimney-roof-work", "🏭", "Комини и обшивки", "Chimneys and Flashings", "Коминни шапки и покривни обшивки.", "Chimney caps and roof flashings."),
        node("roof-safety", "🛡️", "Покривна безопасност", "Roof Safety", "Снегозадържане, парапети и обезопасяване.", "Snow guards, rails and roof safety systems."),
      ],
    }
  ),
  node(
    "facades",
    "🏛️",
    "Фасади",
    "Facades",
    "Фасадни системи, облицовки и реставрация.",
    "Facade systems, cladding and restoration.",
    {
      featured: true,
      children: [
        node("thermal-facades", "🌡️", "Топлоизолационни фасади", "Thermal Facades", "ETICS фасадни топлоизолационни системи.", "ETICS external thermal insulation systems."),
        node("ventilated-facades", "🌬️", "Вентилируеми фасади", "Ventilated Facades", "Сух монтаж на вентилируеми фасади.", "Dry-mounted ventilated facade systems."),
        node("facade-plaster", "🎨", "Фасадни мазилки", "Facade Plaster", "Декоративни и силиконови фасадни мазилки.", "Decorative and silicone facade plasters."),
        node("facade-paint", "🖌️", "Фасадно боядисване", "Facade Painting", "Професионално боядисване на фасади.", "Professional facade painting services."),
        node("stone-facades", "🪨", "Каменни фасади", "Stone Facades", "Облицовка с естествен и изкуствен камък.", "Natural and engineered stone cladding."),
        node("hpl-facades", "🧱", "HPL фасади", "HPL Facades", "Компактни фасадни панели HPL.", "High-pressure laminate facade panels."),
        node("glass-facades", "🪟", "Стъклени фасади", "Glass Facades", "Окачени стъклени фасадни системи.", "Curtain wall and glazed facade systems."),
        node("facade-restoration", "🏛️", "Реставрация на фасади", "Facade Restoration", "Реставрация на стари и исторически фасади.", "Historic and heritage facade restoration."),
      ],
    }
  ),
  node(
    "insulation",
    "🧊",
    "Изолации",
    "Insulation",
    "Топло, хидро, шумо и пароизолации.",
    "Thermal, waterproofing, acoustic and vapor insulation.",
    {
      children: [
        node("thermal-insulation", "🔥", "Топлоизолация", "Thermal Insulation", "Изолация на фасади, покриви и подове.", "Thermal insulation for facades, roofs and floors."),
        node("waterproofing", "💦", "Хидроизолация", "Waterproofing", "Хидроизолация на покриви, тераси и основи.", "Waterproofing for roofs, terraces and foundations."),
        node("acoustic-insulation", "🔇", "Шумоизолация", "Acoustic Insulation", "Шумо и вибро изолационни решения.", "Acoustic and vibration isolation solutions."),
        node("vapor-barrier", "🌫️", "Пароизолация", "Vapor Barrier", "Пароизолации за стени и покриви.", "Vapor barrier systems for walls and roofs."),
        node("fireproof-insulation", "🧯", "Пожарозащитни изолации", "Fireproof Insulation", "Огнеустойчиви изолации и покрития.", "Fire-resistant insulation and coatings."),
        node("basement-insulation", "🏗️", "Изолация на основи", "Basement Insulation", "Изолация на сутерени и подземни части.", "Basement and underground insulation systems."),
        node("attic-insulation", "🏚️", "Тавански изолации", "Attic Insulation", "Изолация на тавани и подпокривни пространства.", "Attic and loft insulation services."),
        node("industrial-insulation", "🏭", "Индустриални изолации", "Industrial Insulation", "Технически и промишлени изолации.", "Technical and industrial insulation."),
      ],
    }
  ),
  node(
    "electrical",
    "⚡",
    "Електро",
    "Electrical",
    "Електроинсталации, автоматизация и силнотокови системи.",
    "Electrical installations, automation and power systems.",
    {
      featured: true,
      popular: true,
      searchKeywords: ["ел", "electrical", "smart home", "солар"],
      children: [
        node("electrical-installations", "🔌", "Ел. инсталации", "Electrical Installations", "Нови електроинсталации и окабеляване.", "New electrical installations and cabling."),
        node("electrical-repair", "🛠️", "Електроремонти", "Electrical Repair", "Диагностика и ремонт на електрически инсталации.", "Electrical diagnostics and repair services."),
        node("switchboards", "📦", "Електрически табла", "Switchboards", "Табла, защити и разпределителни системи.", "Distribution boards and protective systems."),
        node(
          "smart-home",
          "🏠",
          "Smart Home",
          "Smart Home",
          "Интелигентни домашни системи и автоматизация.",
          "Smart home systems and automation.",
          {
            children: [
              node("smart-lighting", "💡", "Умно осветление", "Smart Lighting", "Автоматизирано управление на осветление.", "Automated lighting control solutions."),
              node("smart-security", "📹", "Умна сигурност", "Smart Security", "Сензори, камери и алармени интеграции.", "Sensors, cameras and alarm integrations."),
              node("smart-climate", "🌡️", "Умен климат контрол", "Smart Climate", "Управление на климат и отопление.", "HVAC and heating automation control."),
            ],
          }
        ),
        node("solar-electrical", "☀️", "Соларни системи", "Solar Systems", "Фотоволтаични и соларни електрически решения.", "PV and solar electrical systems."),
        node("ev-chargers", "🚗", "EV Chargers", "EV Chargers", "Монтаж на зарядни станции за електромобили.", "EV charging station installation."),
        node("grounding", "🟢", "Заземяване", "Grounding", "Заземителни и мълниезащитни системи.", "Grounding and lightning protection systems."),
        node("backup-power", "🔋", "Резервно захранване", "Backup Power", "UPS, генератори и резервни захранвания.", "UPS, generator and backup power setups."),
      ],
    }
  ),
  node(
    "plumbing",
    "🚰",
    "ВиК",
    "Plumbing",
    "Водопроводни и канализационни услуги.",
    "Plumbing and drainage services.",
    {
      popular: true,
      children: [
        node("water-installations", "💧", "Водопровод", "Water Installations", "Монтаж и подмяна на водопроводни мрежи.", "Water supply system installation and replacement."),
        node("drainage", "🕳️", "Канализация", "Drainage", "Вътрешна и външна канализация.", "Internal and external drainage networks."),
        node("drain-cleaning", "🧰", "Отпушване", "Drain Cleaning", "Отпушване на канали и сифони.", "Drain and sewer unclogging services."),
        node("pipe-replacement", "🧵", "Смяна на щрангове", "Riser Replacement", "Смяна на вертикални ВиК щрангове.", "Vertical riser replacement services."),
        node("plumbing-emergency", "🚨", "ВиК аварии", "Plumbing Emergency", "Аварийни ВиК ремонти 24/7.", "24/7 emergency plumbing response."),
        node("water-treatment", "🧪", "Пречистване на вода", "Water Treatment", "Филтрация и омекотяване на вода.", "Water filtration and softening systems."),
        node("irrigation", "🌿", "Напоителни системи", "Irrigation", "Напоителни и поливни системи.", "Landscape irrigation and watering systems."),
        node("septic-systems", "🏚️", "Септични системи", "Septic Systems", "Изграждане и поддръжка на септични системи.", "Septic system installation and maintenance."),
      ],
    }
  ),
  node(
    "gasification",
    "🔥",
    "Газификация",
    "Gasification",
    "Газови инсталации и газови отоплителни решения.",
    "Gas installations and gas heating solutions.",
    {
      featured: true,
      children: [
        node("gas-installations", "🛠️", "Газови инсталации", "Gas Installations", "Проектиране и изграждане на газови инсталации.", "Design and installation of gas systems."),
        node("gas-boilers", "♨️", "Газови котли", "Gas Boilers", "Монтаж, ремонт и поддръжка на газови котли.", "Gas boiler installation, repair and servicing."),
        node("gas-maintenance", "🧰", "Поддръжка", "Maintenance", "Профилактика и обслужване на газови системи.", "Preventive maintenance for gas systems."),
        node("gas-design", "📐", "Проектиране", "Design", "Проектиране на газови мрежи и инсталации.", "Gas network and installation design."),
        node("gas-emergency", "🚨", "Аварийни ремонти", "Emergency Repairs", "Аварийни ремонти при газови инсталации.", "Emergency repairs for gas installations."),
        node("gas-detection", "🧯", "Газова безопасност", "Gas Safety", "Системи за газдетекция и безопасност.", "Gas detection and safety systems."),
        node("gas-metering", "📟", "Газово отчитане", "Gas Metering", "Измервателни устройства и контрол.", "Metering and monitoring devices."),
        node("industrial-gas", "🏭", "Индустриална газификация", "Industrial Gasification", "Газификация на индустриални обекти.", "Industrial gasification projects."),
      ],
    }
  ),
  node(
    "hvac",
    "🌡️",
    "ОВК",
    "HVAC",
    "Отопление, вентилация и климатизация.",
    "Heating, ventilation and air conditioning services.",
    {
      featured: true,
      children: [
        node("heat-pumps", "♻️", "Термопомпи", "Heat Pumps", "Монтаж и сервиз на термопомпи.", "Heat pump installation and service."),
        node("air-conditioning", "❄️", "Климатици", "Air Conditioning", "Монтаж и поддръжка на климатични системи.", "Air conditioning installation and maintenance."),
        node("ventilation", "💨", "Вентилация", "Ventilation", "Вентилационни и рекуперационни системи.", "Ventilation and heat recovery systems."),
        node("underfloor-heating", "🔥", "Подово отопление", "Underfloor Heating", "Водно и електрическо подово отопление.", "Hydronic and electric underfloor heating."),
        node("radiator-systems", "🌡️", "Радиаторни системи", "Radiator Systems", "Монтаж на радиаторни отоплителни системи.", "Radiator heating system installation."),
        node("boiler-rooms", "🏭", "Абонатни станции", "Boiler Rooms", "Проектиране и изграждане на абонатни станции.", "Boiler room design and implementation."),
        node("hvac-automation", "🤖", "ОВК автоматика", "HVAC Automation", "Управление и автоматизация на ОВК системи.", "HVAC controls and automation."),
        node("ductwork", "📦", "Въздуховоди", "Ductwork", "Изработка и монтаж на въздуховоди.", "Duct fabrication and installation."),
      ],
    }
  ),
  node(
    "renewable-energy",
    "☀️",
    "Възобновяема енергия",
    "Renewable Energy",
    "Системи за чиста енергия и енергийна независимост.",
    "Clean energy systems for energy independence.",
    {
      featured: true,
      children: [
        node("photovoltaics", "🔋", "Фотоволтаици", "Photovoltaics", "Домашни и индустриални фотоволтаични системи.", "Residential and industrial photovoltaic systems."),
        node("solar-thermal", "🌞", "Соларни колектори", "Solar Thermal", "Соларни системи за гореща вода.", "Solar thermal systems for hot water."),
        node("battery-storage", "🔋", "Батерийни системи", "Battery Storage", "Системи за съхранение на електроенергия.", "Energy storage battery systems."),
        node("microgrids", "🔌", "Микромрежи", "Microgrids", "Локални енергийни микромрежи.", "Local distributed energy microgrids."),
        node("energy-audit", "📝", "Енергиен одит", "Energy Audit", "Енергиен анализ и оптимизация.", "Energy auditing and optimization services."),
        node("building-management", "📊", "Енергиен мениджмънт", "Energy Management", "Системи за мониторинг и управление на енергия.", "Energy monitoring and management systems."),
        node("ev-infrastructure", "🚘", "EV инфраструктура", "EV Infrastructure", "Зарядна инфраструктура за автопаркове.", "EV charging infrastructure for fleets."),
        node("smart-metering", "📈", "Умно измерване", "Smart Metering", "Смарт електромери и отчетност.", "Smart metering and measurement services."),
      ],
    }
  ),
  node(
    "windows-doors",
    "🪟",
    "Дограма и врати",
    "Windows and Doors",
    "Производство и монтаж на дограма и врати.",
    "Window and door manufacturing and installation.",
    {
      children: [
        node("pvc-windows", "🟦", "PVC дограма", "PVC Windows", "PVC прозоречни системи.", "PVC window systems."),
        node("aluminium-windows", "⬜", "Алуминиева дограма", "Aluminium Windows", "Алуминиеви дограми и фасади.", "Aluminium windows and facades."),
        node("wooden-windows", "🪵", "Дървена дограма", "Wooden Windows", "Дървени прозорци и врати.", "Wooden windows and doors."),
        node("entrance-doors", "🚪", "Входни врати", "Entrance Doors", "Монтаж на входни врати.", "Entrance door installation."),
        node("interior-doors", "🚪", "Интериорни врати", "Interior Doors", "Интериорни врати за жилища и офиси.", "Interior doors for homes and offices."),
        node("blinds-shading", "☀️", "Щори и сенници", "Blinds and Shading", "Щори, сенници и перголи.", "Blinds, awnings and shading systems."),
        node("mosquito-nets", "🪰", "Комарници", "Mosquito Nets", "Комарници за прозорци и врати.", "Mosquito net systems for windows and doors."),
        node("garage-doors", "🚗", "Гаражни врати", "Garage Doors", "Секционни и ролетни гаражни врати.", "Sectional and roller garage doors."),
      ],
    }
  ),
  node(
    "metalworks",
    "⚙️",
    "Метални конструкции",
    "Metalworks",
    "Метални конструкции, халета и заваръчни дейности.",
    "Steel structures, halls and welding services.",
    {
      children: [
        node("steel-halls", "🏭", "Метални халета", "Steel Halls", "Проектиране и монтаж на метални халета.", "Steel hall design and erection."),
        node("staircases", "🪜", "Метални стълби", "Metal Staircases", "Изработка на стълби и стъпала.", "Custom metal stairs and steps."),
        node("railings", "🧲", "Парапети", "Railings", "Парапети от стомана и инокс.", "Steel and stainless steel railings."),
        node("gates-fences", "🚧", "Огради и портали", "Gates and Fences", "Метални огради и автоматични портали.", "Metal fences and automated gates."),
        node("welding", "⚒️", "Заваряване", "Welding", "MIG/MAG/TIG заваръчни услуги.", "MIG/MAG/TIG welding services."),
        node("forging", "🛠️", "Коване", "Forging", "Ковани декоративни елементи.", "Forged decorative metal elements."),
        node("canopies", "⛱️", "Навеси и козирки", "Canopies", "Метални навеси и козирки.", "Metal canopies and awnings."),
        node("industrial-platforms", "🏗️", "Индустриални платформи", "Industrial Platforms", "Платформи и метални площадки.", "Industrial steel platforms and walkways."),
      ],
    }
  ),
  node(
    "interior-finish",
    "🛋️",
    "Интериорни довършителни работи",
    "Interior Finishing",
    "Довършителни работи за жилищни и търговски обекти.",
    "Interior finishing for residential and commercial spaces.",
    {
      popular: true,
      children: [
        node("drywall", "🧩", "Гипсокартон", "Drywall", "Преградни стени и окачени тавани.", "Partitions and suspended ceilings."),
        node("plastering", "🪣", "Шпакловка", "Plastering", "Фино шпакловане на стени и тавани.", "Wall and ceiling skim coating."),
        node("painting", "🎨", "Боядисване", "Painting", "Вътрешно боядисване и декоративни техники.", "Interior painting and decorative finishes."),
        node("tiling", "⬜", "Плочки", "Tiling", "Полагане на фаянс, теракот и гранитогрес.", "Ceramic and porcelain tile installation."),
        node("flooring", "🪵", "Подови настилки", "Flooring", "Монтаж на паркет, ламинат и винил.", "Parquet, laminate and vinyl flooring."),
        node("ceilings", "🏚️", "Окачени тавани", "Suspended Ceilings", "Минерални, гипс и метални тавани.", "Mineral, gypsum and metal suspended ceilings."),
        node("wall-panels", "🧱", "Стенни панели", "Wall Panels", "Декоративни стенни панели и облицовки.", "Decorative wall panels and cladding."),
        node("microcement", "🧫", "Микроцимент", "Microcement", "Микроцимент за подове и стени.", "Microcement finishes for floors and walls."),
      ],
    }
  ),
  node(
    "furniture-kitchens",
    "🪑",
    "Мебели и кухни",
    "Furniture and Kitchens",
    "Мебели по поръчка и кухненски решения.",
    "Custom furniture and kitchen solutions.",
    {
      children: [
        node("custom-kitchens", "🍽️", "Кухни по поръчка", "Custom Kitchens", "Проектиране и монтаж на кухни по поръчка.", "Custom kitchen design and installation."),
        node("wardrobes", "🚪", "Гардероби", "Wardrobes", "Вградени и свободностоящи гардероби.", "Built-in and freestanding wardrobes."),
        node("office-furniture", "💼", "Офис мебели", "Office Furniture", "Мебели за офис и работни пространства.", "Furniture for offices and workplaces."),
        node("hotel-furniture", "🏨", "Хотелско обзавеждане", "Hotel Furniture", "Обзавеждане за хотели и туристически обекти.", "Furniture for hotels and hospitality spaces."),
        node("shopfit-furniture", "🏬", "Търговско обзавеждане", "Retail Furniture", "Рафтове, щандове и търговски мебели.", "Retail fixtures and custom furniture."),
        node("furniture-restoration", "🪚", "Реставрация на мебели", "Furniture Restoration", "Ремонт и възстановяване на мебели.", "Furniture repair and restoration."),
        node("upholstery", "🧵", "Тапицерия", "Upholstery", "Претапициране и тапицерски услуги.", "Reupholstery and upholstery services."),
        node("joinery", "🪵", "Дърводелски услуги", "Joinery", "Изработка на дървени интериорни елементи.", "Custom wood joinery services."),
      ],
    }
  ),
  node(
    "landscape",
    "🌿",
    "Озеленяване и ландшафт",
    "Landscaping",
    "Ландшафтен дизайн, озеленяване и поддръжка.",
    "Landscape design, installation and maintenance.",
    {
      children: [
        node("landscape-design", "🧭", "Ландшафтен дизайн", "Landscape Design", "Проектиране на дворове и паркове.", "Landscape design for yards and parks."),
        node("garden-construction", "🌷", "Изграждане на градини", "Garden Construction", "Изграждане на декоративни и функционални градини.", "Decorative and functional garden construction."),
        node("garden-maintenance", "✂️", "Поддръжка на градини", "Garden Maintenance", "Сезонна поддръжка и грижа за растителност.", "Seasonal garden maintenance services."),
        node("irrigation-landscape", "💧", "Поливни системи", "Landscape Irrigation", "Автоматични поливни системи.", "Automated irrigation systems."),
        node("hardscape", "🧱", "Твърда настилка", "Hardscape", "Алеи, бордюри, подпорни стени.", "Pathways, curbs and retaining walls."),
        node("garden-lighting", "💡", "Градинско осветление", "Garden Lighting", "Осветление за дворове и паркове.", "Outdoor and landscape lighting."),
        node("green-roofs", "🌱", "Зелени покриви", "Green Roofs", "Проектиране и изграждане на зелени покриви.", "Green roof design and installation."),
        node("tree-services", "🌳", "Арбористика", "Tree Services", "Подрязване и грижа за дървета.", "Tree pruning and arborist services."),
      ],
    }
  ),
  node(
    "pool-spa",
    "🏊",
    "Басейни и СПА",
    "Pools and SPA",
    "Изграждане и поддръжка на басейни и SPA зони.",
    "Pool and SPA construction and maintenance.",
    {
      children: [
        node("pool-construction", "🏗️", "Изграждане на басейни", "Pool Construction", "Строителство на частни и обществени басейни.", "Private and public pool construction."),
        node("pool-repair", "🔧", "Ремонт на басейни", "Pool Repair", "Ремонт и реконструкция на басейни.", "Pool repair and refurbishment."),
        node("pool-equipment", "⚙️", "Басейн оборудване", "Pool Equipment", "Помпи, филтри и автоматика.", "Pumps, filters and automation equipment."),
        node("spa-zones", "🛁", "СПА зони", "SPA Zones", "Изграждане на SPA и уелнес пространства.", "SPA and wellness area construction."),
        node("saunas", "🧖", "Сауни", "Saunas", "Сухи и парни сауни.", "Dry and steam sauna systems."),
        node("pool-cleaning", "🧼", "Почистване", "Pool Cleaning", "Почистване и химическа поддръжка.", "Pool cleaning and chemical maintenance."),
        node("water-attractions", "🎢", "Водни атракции", "Water Attractions", "Водни пързалки и атракциони.", "Water slides and attractions."),
        node("pool-heating", "🔥", "Отопление на басейни", "Pool Heating", "Отоплителни системи за басейни.", "Pool heating systems."),
      ],
    }
  ),
  node(
    "security",
    "🛡️",
    "Сигурност",
    "Security",
    "Системи за сигурност, контрол и пожарозащита.",
    "Security, access control and fire protection systems.",
    {
      children: [
        node("fire-safety", "🧯", "Пожарна безопасност", "Fire Safety", "Пожароизвестяване и пожарогасене.", "Fire detection and suppression systems."),
        node("cctv", "📹", "Видеонаблюдение", "CCTV", "Камери и видеонаблюдение.", "Video surveillance camera systems."),
        node("intrusion-alarm", "🚨", "СОТ", "Intrusion Alarm", "Охранителни алармени системи.", "Intrusion alarm systems."),
        node("intercom", "🔔", "Домофони", "Intercom", "Домофонни и видеодомофонни решения.", "Audio and video intercom systems."),
        node("access-control", "🗝️", "Контрол на достъп", "Access Control", "Карти, четеци и биометрия.", "Card, reader and biometric access systems."),
        node("perimeter-security", "🚧", "Периметрова защита", "Perimeter Security", "Системи за защита на периметър.", "Perimeter detection and protection systems."),
        node("security-monitoring", "📡", "Мониторинг центрове", "Security Monitoring", "Наблюдение и отдалечен контрол.", "Security monitoring and remote control."),
        node("cyber-physical-security", "🔐", "Интегрирана сигурност", "Integrated Security", "Интегрирани физически и цифрови системи.", "Integrated physical and digital security."),
      ],
    }
  ),
  node(
    "engineering",
    "📐",
    "Проектиране и инженеринг",
    "Design and Engineering",
    "Архитектурно и инженерно проектиране.",
    "Architectural and engineering design services.",
    {
      featured: true,
      children: [
        node("architecture", "🏛️", "Архитектура", "Architecture", "Архитектурно проектиране на сгради.", "Architectural building design."),
        node("structural-engineering", "🧮", "Конструктивно проектиране", "Structural Engineering", "Конструктивни проекти и изчисления.", "Structural design and calculations."),
        node("mep-design", "🔧", "ОВК/ВиК/Ел проектиране", "MEP Design", "Инженерно проектиране на инсталации.", "MEP engineering design services."),
        node("bim-modeling", "🧠", "BIM моделиране", "BIM Modeling", "3D BIM моделиране и координация.", "3D BIM modeling and coordination."),
        node("quantity-surveying", "📏", "Количествени сметки", "Quantity Surveying", "Количествено-стойностни сметки.", "Bills of quantities and cost estimations."),
        node("permits", "📑", "Разрешителни и узаконяване", "Permits", "Административни процедури и разрешителни.", "Permits and legalization procedures."),
        node("construction-supervision", "🛠️", "Строителен надзор", "Construction Supervision", "Технически контрол по време на строеж.", "Construction quality supervision."),
        node("energy-certification", "🏷️", "Енергийно сертифициране", "Energy Certification", "Сертифициране на енергийна ефективност.", "Building energy certification services."),
      ],
    }
  ),
  node(
    "industrial-construction",
    "🏭",
    "Индустриално строителство",
    "Industrial Construction",
    "Проектиране и изпълнение на индустриални обекти.",
    "Design and delivery of industrial facilities.",
    {
      children: [
        node("factories", "🏭", "Производствени сгради", "Factories", "Строителство на производствени сгради.", "Factory and production building construction."),
        node("warehouses", "📦", "Складове", "Warehouses", "Изграждане на складови площи.", "Warehouse construction projects."),
        node("logistics-hubs", "🚚", "Логистични центрове", "Logistics Hubs", "Логистични бази и терминали.", "Logistics centers and terminals."),
        node("industrial-floors", "🧱", "Индустриални подове", "Industrial Floors", "Шлайфан бетон и индустриални настилки.", "Polished concrete and industrial flooring."),
        node("clean-rooms", "🧫", "Чисти помещения", "Clean Rooms", "Проектиране и изграждане на clean rooms.", "Clean room design and construction."),
        node("cold-storage", "🧊", "Хладилни бази", "Cold Storage", "Хладилни и температурно контролирани бази.", "Cold storage facility construction."),
        node("industrial-automation", "🤖", "Индустриална автоматизация", "Industrial Automation", "Автоматизирани производствени линии.", "Industrial process automation systems."),
        node("process-piping", "🧵", "Процесни тръбопроводи", "Process Piping", "Технологични тръбопроводи за индустрията.", "Process piping for industrial plants."),
      ],
    }
  ),
  node(
    "machines-equipment",
    "🚜",
    "Строителни машини и техника",
    "Construction Machinery",
    "Наем, сервиз и управление на строителна техника.",
    "Construction machinery rental, service and management.",
    {
      children: [
        node("excavator-rental", "🚜", "Наем на багери", "Excavator Rental", "Наем на багери и оператори.", "Excavator rental with operators."),
        node("crane-services", "🏗️", "Кранови услуги", "Crane Services", "Кранови услуги и подемна техника.", "Crane and lifting services."),
        node("scaffolding", "🪜", "Скеле", "Scaffolding", "Монтаж и наем на строителни скелета.", "Scaffolding rental and assembly."),
        node("concrete-pumps", "🧪", "Бетонпомпи", "Concrete Pumps", "Транспорт и полагане на бетон с бетонпомпи.", "Concrete pump services."),
        node("road-machinery", "🛣️", "Пътна техника", "Road Machinery", "Фрези, валяци и пътна механизация.", "Road machinery and asphalt equipment."),
        node("machine-service", "🔧", "Сервиз на техника", "Machinery Service", "Сервиз и поддръжка на строителни машини.", "Construction equipment maintenance."),
        node("generator-rental", "🔌", "Генератори под наем", "Generator Rental", "Наем на генератори и агрегати.", "Generator and power unit rental."),
        node("lift-platforms", "📦", "Вишки", "Lift Platforms", "Подемни платформи и вишки.", "Aerial lift platforms and cherry pickers."),
      ],
    }
  ),
  node(
    "road-infrastructure",
    "🛣️",
    "Пътища и инфраструктура",
    "Roads and Infrastructure",
    "Пътно строителство и инфраструктурни проекти.",
    "Road construction and infrastructure projects.",
    {
      children: [
        node("road-construction", "🛣️", "Пътно строителство", "Road Construction", "Изграждане и рехабилитация на пътища.", "Road construction and rehabilitation."),
        node("asphalt-laying", "🧱", "Асфалтиране", "Asphalt Laying", "Полагане на асфалт и настилки.", "Asphalt paving and resurfacing."),
        node("sidewalks", "🚶", "Тротоари и алеи", "Sidewalks", "Тротоари, алеи и градска среда.", "Sidewalk and pedestrian path works."),
        node("water-sewer-networks", "🚰", "ВиК мрежи", "Water and Sewer Networks", "Изграждане на външни ВиК мрежи.", "External water and sewer network construction."),
        node("electrical-grids", "⚡", "Електро мрежи", "Electrical Grids", "Ниско и средно напрежение.", "Low and medium voltage grid works."),
        node("bridges", "🌉", "Мостове", "Bridges", "Мостови съоръжения и реконструкция.", "Bridge structures and reconstruction."),
        node("traffic-safety", "🚦", "Пътна безопасност", "Traffic Safety", "Маркировка, знаци и ограничителни системи.", "Road markings, signage and barriers."),
        node("earthworks", "⛏️", "Земни работи", "Earthworks", "Насипи, изкопи и укрепване на терени.", "Earthworks and terrain stabilization."),
      ],
    }
  ),
  node(
    "property-maintenance",
    "🧹",
    "Поддръжка на сгради",
    "Property Maintenance",
    "Техническа и оперативна поддръжка на имоти.",
    "Technical and operational property maintenance.",
    {
      children: [
        node("facility-management", "🏢", "Фасилити мениджмънт", "Facility Management", "Управление и поддръжка на сгради.", "Building operation and maintenance management."),
        node("electrical-maintenance", "⚡", "Ел. поддръжка", "Electrical Maintenance", "Периодична поддръжка на електро системи.", "Scheduled electrical maintenance."),
        node("plumbing-maintenance", "🚰", "ВиК поддръжка", "Plumbing Maintenance", "Профилактика и ремонт на ВиК инсталации.", "Preventive and corrective plumbing maintenance."),
        node("hvac-maintenance", "❄️", "ОВК поддръжка", "HVAC Maintenance", "Сервиз и профилактика на климатични системи.", "HVAC servicing and preventive maintenance."),
        node("roof-maintenance", "🏠", "Поддръжка на покриви", "Roof Maintenance", "Регулярни инспекции и ремонт на покриви.", "Routine roof inspection and maintenance."),
        node("facade-maintenance", "🏛️", "Поддръжка на фасади", "Facade Maintenance", "Почистване и ремонт на фасади.", "Facade cleaning and maintenance."),
        node("elevator-maintenance", "🛗", "Поддръжка на асансьори", "Elevator Maintenance", "Техническа поддръжка на асансьори.", "Elevator technical maintenance."),
        node("winter-services", "❄️", "Зимна поддръжка", "Winter Services", "Почистване на сняг и противообледеняване.", "Snow removal and de-icing services."),
      ],
    }
  ),
  node(
    "specialized-services",
    "🧪",
    "Специализирани услуги",
    "Specialized Services",
    "Нишови и специализирани строителни услуги.",
    "Niche and specialized construction services.",
    {
      premiumOnly: true,
      children: [
        node("geodesy", "🛰️", "Геодезия", "Geodesy", "Геодезични заснемания и трасиране.", "Surveying and setting out services."),
        node("geology", "🪨", "Инженерна геология", "Engineering Geology", "Геоложки проучвания и анализи.", "Geological investigations and analysis."),
        node("laboratory-testing", "🧫", "Лабораторни изпитвания", "Laboratory Testing", "Изпитване на строителни материали.", "Construction material laboratory testing."),
        node("ndt", "🔍", "Безразрушителен контрол", "NDT", "NDT контрол на конструкции и заварки.", "Non-destructive testing of structures."),
        node("waterproof-injection", "💉", "Инжекционни хидроизолации", "Injection Waterproofing", "Инжекционни системи за спиране на течове.", "Injection systems for leak sealing."),
        node("structural-strengthening", "🧱", "Укрепване на конструкции", "Structural Strengthening", "Укрепване с CFRP, стомана и бетон.", "Structural strengthening with CFRP and steel."),
        node("heritage-restoration", "🏛️", "Реставрация на паметници", "Heritage Restoration", "Реставрационни работи по културно наследство.", "Heritage and monument restoration."),
        node("prefab-modules", "📦", "Модулно строителство", "Modular Construction", "Проектиране и монтаж на модулни сгради.", "Modular building design and assembly."),
      ],
    }
  ),
  node(
    "exterior-improvements",
    "🌳",
    "Екстериор и благоустройство",
    "Exterior and Site Works",
    "Външни пространства, настилки и благоустройство.",
    "Exterior spaces, paving and site improvement works.",
    {
      children: [
        node("paving", "🧱", "Павета и настилки", "Paving", "Павета, плочи и декоративни настилки.", "Pavers, slabs and decorative paving."),
        node("retaining-walls", "🧱", "Подпорни стени", "Retaining Walls", "Проектиране и изпълнение на подпорни стени.", "Retaining wall design and construction."),
        node("pergolas", "🌤️", "Перголи", "Pergolas", "Дървени и метални перголи.", "Wood and metal pergola systems."),
        node("terraces-verandas", "🏡", "Тераси и веранди", "Terraces and Verandas", "Изграждане и обновяване на тераси.", "Terrace and veranda construction."),
        node("fencing", "🚧", "Оградни системи", "Fencing", "Оградни панели и системи за дворове.", "Fence systems for residential and commercial sites."),
        node("outdoor-lighting", "💡", "Външно осветление", "Outdoor Lighting", "Осветление за фасади и дворове.", "Facade and landscape lighting."),
        node("drainage-site", "🌧️", "Отводняване", "Site Drainage", "Отводняване и дренажни системи.", "Site drainage and dewatering solutions."),
        node("street-furniture", "🪑", "Градско обзавеждане", "Street Furniture", "Монтаж на външни съоръжения.", "Outdoor and street furniture installation."),
      ],
    }
  ),
];

async function seedCategoryNode(nodeData: TaxonomyNode, parentId: string | null, sortOrder: number): Promise<void> {
  const category = await prisma.category.upsert({
    where: {
      slug: nodeData.slug,
    },
    update: {
      name: nodeData.bg.name,
      description: nodeData.bg.description,
      icon: nodeData.icon,
      featured: Boolean(nodeData.featured),
      popular: Boolean(nodeData.popular),
      premiumOnly: Boolean(nodeData.premiumOnly),
      searchKeywords: nodeData.searchKeywords || [],
      synonyms: nodeData.synonyms || [],
      parentId,
      sortOrder,
      isActive: true,
    },
    create: {
      name: nodeData.bg.name,
      description: nodeData.bg.description,
      slug: nodeData.slug,
      icon: nodeData.icon,
      featured: Boolean(nodeData.featured),
      popular: Boolean(nodeData.popular),
      premiumOnly: Boolean(nodeData.premiumOnly),
      searchKeywords: nodeData.searchKeywords || [],
      synonyms: nodeData.synonyms || [],
      parentId,
      sortOrder,
      isActive: true,
    },
  });

  await prisma.categoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: category.id,
        locale: "bg",
      },
    },
    update: {
      name: nodeData.bg.name,
      description: nodeData.bg.description,
      seoSlug: nodeData.slug,
      metaTitle: metaTitle(nodeData.bg.name),
      metaDescription: metaDescription(nodeData.bg.description),
    },
    create: {
      categoryId: category.id,
      locale: "bg",
      name: nodeData.bg.name,
      description: nodeData.bg.description,
      seoSlug: nodeData.slug,
      metaTitle: metaTitle(nodeData.bg.name),
      metaDescription: metaDescription(nodeData.bg.description),
    },
  });

  await prisma.categoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId: category.id,
        locale: "en",
      },
    },
    update: {
      name: nodeData.en.name,
      description: nodeData.en.description,
      seoSlug: nodeData.slug,
      metaTitle: metaTitle(nodeData.en.name),
      metaDescription: metaDescription(nodeData.en.description),
    },
    create: {
      categoryId: category.id,
      locale: "en",
      name: nodeData.en.name,
      description: nodeData.en.description,
      seoSlug: nodeData.slug,
      metaTitle: metaTitle(nodeData.en.name),
      metaDescription: metaDescription(nodeData.en.description),
    },
  });

  if (!nodeData.children || nodeData.children.length === 0) {
    return;
  }

  for (let i = 0; i < nodeData.children.length; i += 1) {
    await seedCategoryNode(nodeData.children[i], category.id, i + 1);
  }
}

async function seedCategories() {
  for (let i = 0; i < TAXONOMY.length; i += 1) {
    await seedCategoryNode(TAXONOMY[i], null, i + 1);
  }

  const total = await prisma.category.count();
  const topLevel = await prisma.category.count({ where: { parentId: null } });
  const translations = await prisma.categoryTranslation.count();

  console.log("Category taxonomy seed completed.");
  console.log("Top-level categories:", topLevel);
  console.log("Total categories:", total);
  console.log("Total translations:", translations);
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "BuildTrustBG Admin";

  if (!email || !password) {
    throw new Error(
      "Missing required environment variables: ADMIN_EMAIL and ADMIN_PASSWORD"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("ADMIN seed completed successfully.");
  console.log("Admin email:", admin.email);
  console.log("Admin role:", admin.role);
}

async function main() {
  await seedAdminUser();
  await seedCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
