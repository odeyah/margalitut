import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMenuStore = defineStore('menu', () => {
	// ===== CATEGORIES =====
	const categories = ref([
		{
			id: 'yeast-cakes',
			name: 'עוגות שמרים',
			image: '/cakes/shmarim/yeast.jpeg',
			hoverImage: '/cakes/shmarim/cinamonBobka.jpeg',
			description: 'עוגות שמרים טריות ורכות',
			color: '#F4A460',
			tips: [
				{ icon: '🌡️', title: 'טמפרטורת החדר', text: 'עוגות שמרים יוצאות הכי טוב כשכל החומרים בטמפרטורת החדר' },
				{ icon: '⏰', title: 'זמן תפיחה', text: 'תנו לבצק לתפוח במקום חמים עד שהוא מכפיל את גודלו' },
				{ icon: '🧈', title: 'חמאה רכה', text: 'השתמשו בחמאה רכה אך לא מומסת לקבלת מרקם מושלם' },
				{ icon: '❄️', title: 'אחסון', text: 'ניתן להקפיא עוגות שמרים עד 3 חודשים. חממו בתנור לפני הגשה' },
			],
		},
		{
			id: 'mixed-cakes',
			name: 'עוגות בחושות',
			image: '/cakes/mapelCake.jpeg',
			hoverImage: '/cakes/lemon.jpeg',
			description: 'עוגות בחושות ביתיות ועשירות',
			color: '#DDA0DD',
			tips: [
				{ icon: '🥚', title: 'ביצים בטמפרטורת החדר', text: 'ביצים בטמפרטורת החדר מתערבבות טוב יותר ונותנות מרקם אחיד' },
				{ icon: '🎚️', title: 'לא לערבב יותר מדי', text: 'ערבבו רק עד שהמרכיבים מתחברים - ערבוב יתר יוצר עוגה קשה' },
				{ icon: '🧪', title: 'בדיקת קיסם', text: 'העוגה מוכנה כשקיסם שנכנס למרכז יוצא נקי או עם פירורים יבשים' },
				{ icon: '🕐', title: 'קירור', text: 'תנו לעוגה להתקרר 10 דקות בתבנית לפני הוצאה' },
			],
		},
		{
			id: 'cookies',
			name: 'עוגיות',
			image: '/cookies/dateRolls.jpeg',
			hoverImage: '/cookies/almonds.jpeg',
			description: 'עוגיות פריכות וטעימות',
			color: '#D2691E',
			tips: [
				{ icon: '❄️', title: 'קירור הבצק', text: 'קררו את הבצק 30 דקות לפני אפייה - העוגיות ישמרו על צורתן' },
				{ icon: '📏', title: 'גודל אחיד', text: 'השתמשו בכף גלידה לעוגיות בגודל אחיד שנאפות באותו זמן' },
				{ icon: '🍫', title: 'שוקולד צ׳יפס', text: 'הוסיפו את השוקולד צ׳יפס בסוף הערבוב כדי לא לרסק אותו' },
				{
					icon: '⏱️',
					title: 'זמן אפייה',
					text: 'עוגיות ממשיכות להתקשות אחרי שיוצאות מהתנור - הוציאו כשהן עדיין רכות במרכז',
				},
			],
		},
		{
			id: 'breads',
			name: 'לחמים',
			image: '/bread/rolls.png',
			hoverImage: '/bread/chalakosmin.png',
			description: 'לחמים טריים מהתנור',
			color: '#DEB887',
			tips: [
				{ icon: '💧', title: 'לחות', text: 'הוסיפו קערת מים לתנור בזמן האפייה לקבלת קרום פריך' },
				{ icon: '🌡️', title: 'חימום מוקדם', text: 'חממו את התנור היטב 20 דקות לפני הכנסת הלחם' },
				{ icon: '👂', title: 'בדיקת מוכנות', text: 'הלחם מוכן כשמקישים עליו מלמטה ושומעים צליל חלול' },
				{ icon: '🔪', title: 'חיתוך', text: 'המתינו לפחות 15 דקות לפני חיתוך כדי שהלחות תתפזר' },
			],
		},
		{
			id: 'sugar-free',
			name: 'ללא סוכר',
			image: '/cookies/dateRolls.jpeg',
			hoverImage: '',
			description: 'מתוקים בריאים ללא סוכר',
			color: '#90EE90',
			tips: [
				{ icon: '🍌', title: 'תחליפי סוכר טבעיים', text: 'בננות בשלות, תמרים ודבש הם תחליפים טבעיים מצוינים' },
				{ icon: '🥄', title: 'סטיביה', text: 'סטיביה מתוקה פי 200 מסוכר - השתמשו בכמות קטנה מאוד' },
				{ icon: '🍎', title: 'רסק תפוחים', text: 'רסק תפוחים מוסיף מתיקות טבעית ולחות לאפייה' },
				{ icon: '⚖️', title: 'התאמת מרקם', text: 'אפייה ללא סוכר עשויה להיות יבשה יותר - הוסיפו שמן או יוגורט' },
			],
		},
		{
			id: 'gluten-free',
			name: 'ללא גלוטן',
			image: '',
			hoverImage: '',
			description: 'אפייה ללא גלוטן',
			color: '#F0E68C',
			tips: [
				{ icon: '🥣', title: 'תערובת קמחים', text: 'שלבו כמה סוגי קמחים ללא גלוטן לקבלת מרקם טוב יותר' },
				{ icon: '🥚', title: 'יותר ביצים', text: 'הוסיפו ביצה נוספת למתכון - זה עוזר לקשור את הבצק' },
				{ icon: '⏰', title: 'זמן מנוחה', text: 'תנו לבצק לנוח 30 דקות לפני אפייה - הקמחים סופגים נוזלים' },
				{ icon: '🧹', title: 'נקיון', text: 'ודאו שכל הכלים נקיים מגלוטן למניעת זיהום צולב' },
			],
		},
		{
			id: 'vegan',
			name: 'טבעוני',
			image: '/bread/chalakosmin.png',
			hoverImage: '',
			description: 'מאפים טבעוניים ללא מוצרי בעלי חיים',
			color: '#98FB98',
			tips: [
				{ icon: '🍌', title: 'תחליף ביצים', text: 'בננה מועכת, רסק תפוחים או פשתן טחון עם מים מחליפים ביצים' },
				{ icon: '🥛', title: 'חלב צמחי', text: 'חלב שקדים, סויה או קוקוס עובדים מצוין באפייה' },
				{ icon: '🧈', title: 'שמנים', text: 'שמן קוקוס או מרגרינה טבעונית מחליפים חמאה' },
				{ icon: '🍫', title: 'שוקולד', text: 'בדקו שהשוקולד מריר ללא חלב - רוב השוקולד המריר טבעוני' },
			],
		},
		{
			id: 'ice-cream',
			name: 'גלידות',
			image: '',
			hoverImage: '',
			description: 'גלידות ביתיות בטעמים מיוחדים',
			color: '#FFB6C1',
			tips: [
				{ icon: '❄️', title: 'הקפאה נכונה', text: 'הוציאו את הגלידה מהמקפיא 10 דקות לפני הגשה לקבלת מרקם קרמי' },
				{ icon: '🥄', title: 'כלי הגשה', text: 'טבלו את כף הגלידה במים חמים לכדורים חלקים יותר' },
				{ icon: '🍯', title: 'מניעת גבישי קרח', text: 'הוסיפו כף דבש או סירופ לתערובת למניעת גבישי קרח' },
				{ icon: '📦', title: 'אחסון', text: 'כסו את הגלידה בנייר פרגמנט לפני סגירת המכסה למניעת גבישים' },
			],
		},
		{
			id: 'dairy-meals',
			name: 'ארוחות חלביות',
			image: '',
			hoverImage: '',
			description: 'ארוחות חלביות טריות וטעימות',
			color: '#FFA07A',
			hasSubcategories: true,
			tips: [
				{ icon: '🧀', title: 'גבינות', text: 'שלבו כמה סוגי גבינות לקבלת טעם עשיר ומורכב יותר' },
				{ icon: '🌡️', title: 'טמפרטורה', text: 'הגישו פסטות ופיצות מיד - הן הכי טעימות כשהן חמות' },
				{ icon: '🥗', title: 'סלטים', text: 'הוסיפו את הרוטב רק לפני ההגשה כדי שהסלט יישאר פריך' },
				{ icon: '🍕', title: 'פיצה ביתית', text: 'חממו את התנור למקסימום והשתמשו באבן אפייה לתחתית פריכה' },
			],
		},
		{
			id: 'birthday-cakes',
			name: 'עוגות יום הולדת חגים ואירועים',
			image: '',
			hoverImage: '',
			description: 'עוגות מעוצבות ליום הולדת חגים ואירועים מיוחדים',
			color: '#FF69B4',
			tips: [
				{ icon: '📅', title: 'הזמנה מראש', text: 'מומלץ להזמין לפחות 5-7 ימים מראש לעוגות מעוצבות' },
				{ icon: '🎨', title: 'התאמה אישית', text: 'אפשר להתאים צבעים, כיתוב ועיצוב לפי בקשה' },
				{ icon: '🚗', title: 'משלוח', text: 'עוגות קומות מומלץ לאסוף עצמאית או במשלוח מיוחד' },
				{ icon: '❄️', title: 'אחסון', text: 'יש לאחסן במקרר ולהוציא שעה לפני ההגשה' },
			],
		},
		{
			id: 'baking-workshops',
			name: 'חוגי אפייה',
			image: '',
			hoverImage: '',
			color: '#d34a6e',
			description: 'חוגי אפייה לילדים בכל הגילאים',
			isExternal: false,
		},
	]);

	// ===== DAIRY MEALS SUBCATEGORIES =====
	const dairySubcategories = ref([
		{ id: 'pizzas', name: 'פיצות', image: '', hoverImage: '' },
		{ id: 'quiches', name: 'קישים', image: '', hoverImage: '' },
		{ id: 'salads', name: 'סלטים', image: '', hoverImage: '' },
		{ id: 'pastas', name: 'פסטות', image: '', hoverImage: '' },
		{ id: 'soups', name: 'מרקים', image: '', hoverImage: '' },
	]);

	// ===== PRODUCTS =====
	const products = ref([
		// עוגות שמרים

		{
			id: 1,
			name: 'שמרים שוקולד',
			category: 'yeast-cakes',
			price: 60,
			image: '/cakes/shmarim/bobka.jpeg',
			description:
				'בובקה שוקולד ביתית עם שכבות שוקולד בלגי עשיר ונמס. עוגת שמרים רכה ולחה אפויה טרייה במאפיית מרגליתות בית שמש. מושלמת לשבת, לאירועים ולמתנה',
			popular: true,
		},
		{
			id: 2,
			name: 'שמרים קינמון',
			category: 'yeast-cakes',
			price: 60,
			image: '/cakes/shmarim/cinamonBobka.jpeg',
			description:
				'בובקה קינמון קלאסית עם סוכר חום וקינמון ציילוני אמיתי. עוגת שמרים ביתית רכה עם ניחוח שממלא את הבית. טעם של שבת ישראלית - מאפיית מרגליתות בית שמש',
		},
		{
			id: 3,
			name: 'קראנץ גבינה',
			category: 'yeast-cakes',
			price: 65,
			image: '/cakes/shmarim/chease.jpg',
			description:
				'קראנץ גבינה מתוקה עם בצק שמרים רך ושכבות מילוי גבינה קרמי עשיר. עוגת שמרים חלבית מושלמת לארוחת בוקר שישי ושבת. מאפיית מרגליתות בית שמש',
			popular: true,
		},
		{
			id: 4,
			name: 'קראנץ תפוחים',
			category: 'yeast-cakes',
			price: 65,
			image: '/cakes/shmarim/apple.jpeg',
			description:
				'קראנץ תפוחים ביתי עם תפוחי עץ טריים, קינמון וסוכר חום. עוגת שמרים עם מילוי פירות טבעי בטעם של בית סבתא. מאפיית מרגליתות בית שמש - אפייה טרייה',
			popular: true,
		},
		{
			id: 6,
			name: 'שמרים פרג',
			category: 'yeast-cakes',
			price: 65,
			image: '',
			description:
				'עוגת שמרים פרג מסורתית עם מילוי פרג אמיתי ועשיר. מתכון משפחתי מקורי מדור לדור בטעם נוסטלגי של פעם. מאפיית מרגליתות בית שמש',
		},
		{
			id: 8,
			name: 'שמרים תותים וקוקוס',
			category: 'yeast-cakes',
			price: 65,
			image: '',
			description:
				'עוגת שמרים במילוי תותים וקוקוס טרופי - שילוב מרענן ומיוחד. עוגה קייצית ומפנקת בטעם פירותי. מאפיית מרגליתות בית שמש - טעם ייחודי',
		},
		{
			id: 10,
			name: 'חלבה שוקולד',
			category: 'yeast-cakes',
			price: 60,
			image: '',
			description:
				'עוגת שמרים במילוי חלבה טחינה ושוקולד מריר - שילוב ישראלי מקורי של טעמים מזרחיים. עוגה ייחודית בטעם של הבית. מאפיית מרגליתות בית שמש',
		},
		{
			id: 11,
			name: 'שמרים בטעם נוטלה',
			category: 'yeast-cakes',
			price: 65,
			image: '',
			description:
				'בובקה עם ממרח בטעם נוטלה שוקולד אגוזים עשיר וקרמי. עוגת שמרים אהובה על ילדים ומבוגרים. פינוק מתוק לכל המשפחה - מאפיית מרגליתות בית שמש',
		},
		{
			id: 12,
			name: 'רוגלך שוקולד/קינמון',
			category: 'yeast-cakes',
			price: 65,
			image: '/cakes/shmarim/cinimonRogalach.jpg',
			description:
				'רוגלך ביתי במילוי שוקולד או קינמון לבחירה - מגש כ-12 יחידות. בצק שמרים רך עם מילוי עשיר. מושלם לאירוח ולשבת - מאפיית מרגליתות בית שמש',
		},
		{
			id: 13,
			name: 'שבלולי קינמון/שוקולד',
			category: 'yeast-cakes',
			price: 65,
			image: '',
			description:
				'שבלולי קינמון או שוקולד - סינבון ביתי אמיתי כמו בבית קפה. מגש כ-9 שבלולים עם בצק רך וציפוי קרם מתוק. מאפיית מרגליתות בית שמש',
		},
		{
			id: 14,
			name: 'שושני גבינה',
			category: 'yeast-cakes',
			price: 60,
			image: '/cakes/shmarim/CheaseSnails.png',
			description:
				'שושני גבינה מתוקה בצורת פרח יפהפה עם בצק שמרים רך ומילוי גבינה קרמית. מגש מרשים לאירוח, לשבת ולחגים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 15,
			name: 'קוראסון שוקולד אמיתי',
			category: 'yeast-cakes',
			price: 65,
			image: '',
			description:
				'קרואסון שוקולד צרפתי אותנטי עם שוקולד בלגי אמיתי בפנים. בצק חמאה שכבות פריך ורך כמו בקונדיטוריה בפריז. מאפיית מרגליתות בית שמש',
		},

		// עוגות בחושות
		{
			id: 17,
			name: 'פס שוקולד עשיר',
			category: 'mixed-cakes',
			price: 45,
			image: '',
			description:
				'עוגת שוקולד כהה עשירה ולחה במיוחד - מתכון סודי של מאפיית מרגליתות. עוגת שוקולד ביתית שנמסה בפה, מושלמת לשבת ולאירועים. בית שמש',
			popular: true,
		},
		{
			id: 18,
			name: 'מאפינס אוכמניות',
			category: 'mixed-cakes',
			price: 55,
			image: '/cakes/blueberrysMafins.jpeg',
			description:
				'מאפינס אוכמניות טריים - מארז 5 יחידות. מאפינס רכים ולחים עם אוכמניות אמיתיות בפנים. מושלם לארוחת בוקר ולילדים - מאפיית מרגליתות בית שמש',
		},
		{
			id: 19,
			name: 'בראוניז שוקולד גבינה',
			category: 'mixed-cakes',
			price: 65,
			image: '/cakes/cheseBrounies.png',
			description:
				'בראוניז שוקולד עם שכבת גבינה מארבל מרהיבה - שילוב מושלם של שוקולד כהה וגבינה קרמית. קינוח יוקרתי לאירועים - מאפיית מרגליתות בית שמש',
		},
		{
			id: 20,
			name: 'פס לימון',
			category: 'mixed-cakes',
			price: 45,
			image: '/cakes/lemon.jpeg',
			description:
				'עוגת לימון ביתית רעננה עם גלייז לימון חמצמץ וניחוח הדרים. עוגה קלילה מושלמת לקיץ ולאירוח קליל. מאפיית מרגליתות בית שמש',
		},
		{
			id: 21,
			name: 'סולת תפוז',
			category: 'mixed-cakes',
			price: 45,
			image: '/cakes/soletTapuz.jpeg',
			description:
				'עוגת סולת תפוז חלבית עסיסית בסגנון מרוקאי מסורתי. סירופ תפוזים עשיר נספג בפנים ויוצר עוגה רווית ומפנקת. מאפיית מרגליתות בית שמש',
		},
		{
			id: 22,
			name: 'עוגת פירות יבשים',
			category: 'mixed-cakes',
			price: 70,
			image: '/cakes/dryedFrutesCake.jpeg',
			description:
				'עוגת פירות יבשים עשירה עם תאנים, תמרים, משמש ואגוזים. עוגה חגיגית מושלמת לטו בשבט, לראש השנה ולכל אירוע. מאפיית מרגליתות בית שמש',
		},
		{
			id: 23,
			name: 'קראמבל קפה',
			category: 'mixed-cakes',
			price: 80,
			image: '/cakes/cafeCrambelNuts.png',
			description:
				'עוגת קראמבל קפה בסגנון אמריקאי עם שכבת פירורים פריכה ואגוזים קלויים. מושלמת לצד קפה של בוקר או אחר הצהריים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 24,
			name: 'פאי פיצוחים',
			category: 'mixed-cakes',
			price: 80,
			image: '/cakes/payPitzuchim.png',
			description:
				'פאי פיצוחים עשיר עם פקאן, אגוזי מלך ושקדים בקרמל ביתי. עוגה אמריקאית קלאסית - קינוח חגיגי לאירועים ולחגים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 37,
			name: 'גבינה אוכמניות',
			category: 'mixed-cakes',
			price: 250,
			image: '',
			description:
				'עוגת גבינה אפויה קרמית עם שכבת אוכמניות טריות - קוטר 24 ס"מ, כ-12 מנות. עוגת גבינה יוקרתית לאירועים ולימי הולדת. מאפיית מרגליתות בית שמש',
		},
		{
			id: 26,
			name: 'עוגה אנגלית חלבית',
			category: 'mixed-cakes',
			price: 55,
			image: '',
			description:
				'עוגה אנגלית חלבית קלאסית עם קליפות הדרים מסוכרות בסגנון בריטי מקורי. מושלמת לתה אחר הצהריים ולאירוח. מאפיית מרגליתות בית שמש',
		},
		{
			id: 27,
			name: 'מייפל אגוזים',
			category: 'mixed-cakes',
			price: 50,
			image: '/cakes/mapelCake.jpeg',
			description:
				'עוגת מייפל ביתית עם אגוזי מלך קלויים - עוגה רכה ולחה בטעם מייפל עדין. פינוק סתווי מושלם לכל המשפחה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 28,
			name: 'מייפל טבעי ואגוזים',
			category: 'mixed-cakes',
			price: 55,
			image: '/cakes/mapelCake.jpeg',
			description:
				'עוגת מייפל פרימיום עם סירופ מייפל טבעי 100% מקנדה ואגוזים. גרסה יוקרתית בטעם עשיר ומיוחד לחובבי מייפל אמיתיים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 29,
			name: 'עוגת טו בשבט',
			category: 'mixed-cakes',
			price: 70,
			image: '',
			description:
				'עוגת שוקולד מעוצבת לטו בשבט עם פירות יבשים ואגוזים. עוגה חגיגית לחג האילנות - מתאימה לכיתות, למשפחות ולמתנות. מאפיית מרגליתות בית שמש',
		},
		{
			id: 30,
			name: 'דמקה שכבות גבינה',
			category: 'mixed-cakes',
			price: 80,
			image: '',
			description:
				'עוגת דמקה מרשימה עם שכבות גבינה ושוקולד בדוגמת שחמט. עוגה מיוחדת ויפהפיה לאירועים - כ-12 מנות. מאפיית מרגליתות בית שמש',
		},
		{
			id: 31,
			name: 'גבינה פירורים',
			category: 'mixed-cakes',
			price: 250,
			image: '/cakes/chesecake.png',
			description:
				'עוגת גבינה אפויה ישראלית קלאסית עם שכבת פירורים חמאתית פריכה. טעם נוסטלגי של פעם - עוגת גבינה ביתית אמיתית. מאפיית מרגליתות בית שמש',
		},
		{
			id: 32,
			name: 'עוגת גבינה קרה',
			category: 'mixed-cakes',
			price: 65,
			image: '/cakes/cheseChoclateCake.png',
			description:
				'עוגת פס גבינה קרה קלילה בציפוי גנאש שוקולד מריר - ללא אפייה. עוגה קרמית ומרעננת מושלמת לקיץ ולאירוח. מאפיית מרגליתות בית שמש',
		},
		{
			id: 34,
			name: 'גבינה אוריאו',
			category: 'mixed-cakes',
			price: 250,
			image: '/cakes/oreoChese.jpeg',
			description:
				'עוגת גלידה גבינה אוריאו מפנקת - קוטר 24 ס"מ, כ-12 מנות. עוגת גבינה קרמית עם עוגיות אוריאו מעל ובפנים. פינוק אמריקאי - מאפיית מרגליתות בית שמש',
		},
		{
			id: 35,
			name: 'סופלה שוקולד',
			category: 'mixed-cakes',
			price: 45,
			image: '/cakes/sofle.jpeg',
			description:
				'סופלה שוקולד ביתי - מארז 5 יחידות. לבבות שוקולד עם מרכז נוזלי וחם שנמס בפה. קינוח רומנטי ומרשים לאירועים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 36,
			name: 'בראוניז',
			category: 'mixed-cakes',
			price: 45,
			image: '/cakes/brounies.jpg',
			description:
				'בראוניז שוקולד קלאסיים עשירים ולחים עם שוקולד בלגי איכותי - מגש כ-9 חתיכות. מתכון אמריקאי מושלם לחובבי שוקולד. מאפיית מרגליתות בית שמש',
		},

		// עוגיות
		{
			id: 41,
			name: "מופלאות שוקולד צ'יפס",
			category: 'cookies',
			price: 55,
			image: '/cookies/choclatechips.jpg',
			description:
				"עוגיות שוקולד צ'יפס ביתיות פריכות עם שוקולד בלגי איכותי בנדיבות. עוגיות אמריקאיות כמו בבית קפה - נמכרות כמו לחמניות חמות. מאפיית מרגליתות בית שמש",
			popular: true,
		},
		{
			id: 43,
			name: "שוקולד צ'יפס תות מקורי",
			category: 'cookies',
			price: 65,
			image: '/cookies/choclatechips.jpg',
			description:
				"עוגיות שוקולד צ'יפס עם תותים מיובשים - שילוב מיוחד ומקורי שלא תמצאו במקום אחר. עוגיות פרימיום מושלמות למתנה ולאירוח. מאפיית מרגליתות בית שמש",
			popular: true,
		},
		{
			id: 45,
			name: 'עוגיות חמאה פקאן',
			category: 'cookies',
			price: 65,
			image: '',
			description:
				'עוגיות חמאה פריכות עם אגוזי פקאן קלויים בסגנון צרפתי יוקרתי. עוגיות חמאה איכותיות לאירוח מיוחד ולמתנות. מאפיית מרגליתות בית שמש',
		},
		{
			id: 46,
			name: 'סהרוני שקדים',
			category: 'cookies',
			price: 65,
			image: '',
			description:
				'עוגיות סהרוני שקדים פריכות בצורת ירח עם אבקת סוכר עדינה. עוגיות חג קלאסיות שנמסות בפה - מתכון אירופאי מסורתי. מאפיית מרגליתות בית שמש',
		},
		{
			id: 47,
			name: 'עוגיות בריאות',
			category: 'cookies',
			price: 60,
			image: '',
			description:
				'עוגיות בריאות עם שיבולת שועל, דבש טבעי וזרעים מזינים. עוגיות טעימות ומזינות לארוחת עשר ולילדים - בריא וטעים ביחד. מאפיית מרגליתות בית שמש',
		},
		{
			id: 48,
			name: 'פרח ריבה',
			category: 'cookies',
			price: 60,
			image: '',
			description:
				'עוגיות פרח ריבה - עוגיות חמאה פריכות בצורת פרח עם ריבת תות באמצע. עוגיות קלאסיות צבעוניות ויפות לאירוח ולילדים. מאפיית מרגליתות בית שמש',
			popular: true,
		},
		{
			id: 49,
			name: 'מגולגלות תמרים ללא סוכר',
			category: ['cookies', 'sugar-free'],
			price: 55,
			image: '',
			description:
				'מגולגלות תמרים ללא סוכר מוסף - עוגיות מעמול פריכות במילוי תמרים טבעי. מתאימות לסוכרתיים ולדיאטה - טעם מלא בלי סוכר. מאפיית מרגליתות בית שמש',
		},
		{
			id: 50,
			name: 'קוקילידה',
			category: 'cookies',
			price: 14,
			image: '',
			description:
				'קוקילידה ביתית - עוגיית קוקוס שוקולד גדולה ופריכה ליחידה. עוגייה נוסטלגית בטעם של פעם שמזכירה את הילדות. מאפיית מרגליתות בית שמש',
		},
		{
			id: 51,
			name: 'חיתוכיות תות תפוח',
			category: 'cookies',
			price: 60,
			image: '',
			description:
				'חיתוכיות שכבות עם ריבת תות ותפוח מרעננת. עוגיות פריכות וטעימות - מגש מארח מושלם לאירוח ולשבת. מאפיית מרגליתות בית שמש',
		},
		{
			id: 52,
			name: 'עוגיות לוקום',
			category: 'cookies',
			price: 60,
			image: '',
			description:
				'עוגיות רחת לוקום - עוגיות חמאה עדינות עם קוביות לוקום ורדים. עוגיות מזרחיות אלגנטיות בטעם מיוחד וייחודי. מאפיית מרגליתות בית שמש',
		},
		{
			id: 53,
			name: 'עוגיות קוקוס ושוקולד',
			category: 'cookies',
			price: 50,
			image: '',
			description:
				"עוגיות קוקוס פריכות עם שוקולד צ'יפס - שילוב טרופי ושוקולדי מנצח. עוגיות אהובות על ילדים ומבוגרים. מאפיית מרגליתות בית שמש",
		},
		{
			id: 55,
			name: 'שומשומיות',
			category: 'cookies',
			price: 50,
			image: '',
			description:
				'שומשומיות ביתיות פריכות - עוגיות שומשום מסורתיות בסגנון מזרחי. עוגיות בריאות ומזינות במתכון של סבתא. מאפיית מרגליתות בית שמש',
		},
		{
			id: 56,
			name: 'ריפאת',
			category: 'cookies',
			price: 50,
			image: '',
			description:
				'ריפאת - עוגיות קוקוס וקונדנס מילק מסורתיות שנמסות בפה. עוגיות מרוקאיות קלאסיות במתכון משפחתי מקורי. מאפיית מרגליתות בית שמש',
		},
		{
			id: 57,
			name: 'אצבעות פילו במגוון מילויים',
			category: 'cookies',
			price: 50,
			image: '',
			description:
				'אצבעות פילו פריכות - 5 יח׳ במילוי חלבה, שקדים או אגוזים לבחירה, בזיגוג מייפל או סילאן. קינוח מזרחי מפנק. מאפיית מרגליתות בית שמש',
		},
		{
			id: 58,
			name: 'לימוניות',
			category: 'cookies',
			price: 50,
			image: '',
			description:
				'עוגיות לימון רעננות עם גלייז לימון חמצמץ בטעם הדרים. עוגיות קייציות מרעננות מושלמות לאחר הצהריים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 59,
			name: 'עוגיות קפה ארומטיות',
			category: 'cookies',
			price: 50,
			image: '',
			description:
				'עוגיות קפה ארומטיות עם אספרסו אמיתי - עוגיות לאוהבי קפה עם ניחוח וטעם קפה עשיר. מושלמות לצד קפה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 60,
			name: 'מושלגות פרג',
			category: 'cookies',
			price: 50,
			image: '',
			description:
				'עוגיות פרג מושלגות באבקת סוכר עדינה - עוגיות פרג מסורתיות בסגנון אירופאי קלאסי. עוגיות חורפיות מפנקות. מאפיית מרגליתות בית שמש',
		},
		{
			id: 61,
			name: 'מגולגלות חלבה',
			category: 'cookies',
			price: 55,
			image: '',
			description:
				'מגולגלות חלבה פריכות - עוגיות מעמול במילוי חלבה טחינה עשירה שנמסות בפה. עוגיות ישראליות מקוריות בטעם של הבית. מאפיית מרגליתות בית שמש',
		},
		{
			id: 62,
			name: 'עוגיות אגוזים קינמון',
			category: 'cookies',
			price: 60,
			image: '',
			description:
				'עוגיות אגוזים וקינמון חורפיות עם אגוזי מלך קלויים וקינמון ארומטי. ניחוח ביתי חם מושלם לחורף. מאפיית מרגליתות בית שמש',
		},
		{
			id: 64,
			name: 'חיתוכיות חמאת בוטנים',
			category: 'cookies',
			price: 45,
			image: '',
			description:
				'חיתוכיות חמאת בוטנים ושוקולד - שילוב אמריקאי קלאסי ואהוב. עוגיות עשירות בחלבון - פינוק לכל המשפחה. מאפיית מרגליתות בית שמש',
		},

		// לחמים
		{
			id: 70,
			name: 'מארז לחמניות הבית לבן',
			category: ['vegan', 'breads'],
			price: 25,
			image: '/bread/rolls.jpeg',
			description:
				'לחמניות ביתיות טריות מקמח לבן - מארז 5 יח׳. לחמניות רכות מושלמות לסנדוויצ׳ים והמבורגר ביתי. אפייה טרייה יומית במאפיית מרגליתות בית שמש',
			popular: true,
		},
		{
			id: 71,
			name: 'חלה',
			category: ['vegan', 'breads'],
			price: 25,
			image: '/bread/chala.jpeg',
			description:
				'חלה ביתית לשבת - חלה קלועה רכה וטרייה מקמח איכותי. מתכון מסורתי משפחתי מדור לדור. ניחוח של ערב שבת ישראלי - מאפיית מרגליתות בית שמש',
		},
		{
			id: 72,
			name: 'מארז לחמניות הבית כוסמין 80%',
			category: ['vegan', 'breads'],
			price: 35,
			image: '/bread/rolls.png',
			description:
				'לחמניות כוסמין 80% בריאות - מארז 5 יח׳. לחמניות מקמח מלא עשירות בסיבים תזונתיים וויטמינים. לחם בריא וטעים לכל המשפחה - אפייה ביתית בבית שמש',
		},
		{
			id: 73,
			name: 'חלת כוסמין 80%',
			category: ['vegan', 'breads'],
			price: 35,
			image: '/bread/chalaKosmin3.png',
			description:
				'חלת כוסמין 80% בריאה לשבת - חלה מקמח מלא עם ערך תזונתי גבוה. חלה טעימה ובריאה בלי פשרות על הטעם. מאפיית מרגליתות בית שמש',
		},
		{
			id: 74,
			name: 'לחמניות שום כוסמין 80%',
			category: ['vegan', 'breads'],
			price: 40,
			image: '/bread/garlicRolls.png',
			description:
				"לחמניות שום בריאות מכוסמין 80% - מארז 5 יח'. לחמניות ארומטיות בטעם שום ועשבי תיבול טריים. מושלמות לצד מרק, פסטה או סלט - מבית שמש",
		},
		{
			id: 75,
			name: 'פיתה זעתר ושומשום',
			category: ['vegan', 'breads'],
			price: 12,
			image: '',
			description:
				'פיתה ביתית טרייה עם זעתר ושומשום - תיבול ישראלי אותנטי. פיתה רכה מושלמת לארוחת בוקר ישראלית עם חומוס, לבנה וסלט. מאפיית מרגליתות',
		},
		{
			id: 76,
			name: 'לחמניות שום',
			category: ['vegan', 'breads'],
			price: 30,
			image: '/bread/garlicBread1.png',
			description:
				'לחמניות שום ביתיות ארומטיות - מארז 5 יח׳. לחמניות רכות בטעם שום עשיר וחמאתי. מושלמות לצד פסטה איטלקית, מרקים וסלטים - מבית שמש',
		},
		{
			id: 77,
			name: 'לחמניות מתוקות',
			category: 'breads',
			price: 45,
			image: '/bread/sweetRools.png',
			description:
				'לחמניות מתוקות עם צימוקים עסיסיים - מארז 5 יח׳. לחמניות רכות ומתוקות בסגנון ביתי לארוחת בוקר מפנקת. אהובות על ילדים - מאפיית מרגליתות בית שמש',
		},

		// ==================== ללא סוכר ====================
		{
			id: 81,
			name: 'עוגיות שיבולת שועל ללא סוכר',
			category: ['cookies', 'sugar-free'],
			price: 65,
			image: '',
			description:
				'עוגיות שיבולת שועל בריאות ללא סוכר מוסף - ממותקות בדבש טבעי וזרעים. עוגיות מזינות לסוכרתיים, לדיאטה ולכל המשפחה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 82,
			name: 'פס גבינה אפויה ללא סוכר',
			category: ['cookies', 'sugar-free'],
			price: 75,
			image: '',
			description:
				'עוגת גבינה אפויה ללא סוכר מוסף - עוגת גבינה קרמית ועשירה מתאימה לסוכרתיים ולדיאטה. כל הטעם בלי הסוכר. מאפיית מרגליתות בית שמש',
		},
		{
			id: 83,
			name: 'פס גבינה קרה ללא סוכר',
			category: ['cakes', 'sugar-free'],
			price: 95,
			image: '',
			description:
				'עוגת גבינה קרה ללא סוכר מוסף - קינוח קליל וקרמי לסוכרתיים, לדיאטה ולמודעים לבריאות. טעם מלא בלי פשרות. מאפיית מרגליתות בית שמש',
		},

		// ==================== ללא גלוטן ====================
		{
			id: 90,
			name: 'פס שוקולד עשיר',
			category: ['gluten-free', 'cakes'],
			price: 75,
			image: '',
			description:
				'עוגת שוקולד ללא גלוטן על בסיס קמח שקדים איכותי. עוגה עשירה ולחה לצליאקים ולרגישים לגלוטן. טעם מלא כמו עוגה רגילה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 91,
			name: 'עוגיות קוקוס',
			category: ['gluten-free', 'cookies'],
			price: 65,
			image: '',
			description:
				'עוגיות קוקוס ללא גלוטן - עוגיות פריכות מקוקוס טהור. מתאימות לצליאקים ולרגישים לגלוטן, גם טבעוניות. מאפיית מרגליתות בית שמש',
		},
		{
			id: 92,
			name: 'פס גבינה',
			category: ['gluten-free', 'cakes'],
			price: 95,
			image: '',
			description:
				'עוגת גבינה אפויה ללא גלוטן - עוגת גבינה קרמית על בסיס שקדים. מתאימה לצליאקים ולרגישים לגלוטן. טעימה כמו הרגיל. מאפיית מרגליתות בית שמש',
		},

		// ==================== טבעוני ====================
		{
			id: 100,
			name: 'עוגיות טבעוניות',
			category: ['vegan', 'cookies'],
			price: 70,
			image: '',
			description:
				'עוגיות שוקולד טבעוניות - עוגיות טעימות ללא ביצים וללא חלב. מתאימות לטבעונים ולרגישים ללקטוז. מתכון ייחודי של מאפיית מרגליתות בית שמש',
		},
		{
			id: 101,
			name: 'מאפינס טבעוניים',
			category: ['vegan', 'cakes'],
			price: 70,
			image: '',
			description:
				'מאפינס אוכמניות טבעוניים - מאפינס רכים ולחים ללא מוצרי חלב וביצים. טעימים כמו מאפינס רגילים. מתאימים לטבעונים. מאפיית מרגליתות בית שמש',
		},

		// גלידות
		{
			id: 110,
			name: 'גלידת וניל',
			category: ['ice-cream', 'gluten-free'],
			price: 120,
			image: '',
			description:
				'גלידת וניל ביתית קילו - גלידה איטלקית קרמית בטעם וניל מדגסקר קלאסי. ללא חומרים משמרים, ללא גלוטן. מאפיית מרגליתות בית שמש',
			popular: true,
		},
		{
			id: 111,
			name: 'גלידת שוקולד',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת שוקולד בלגי ביתית קילו - גלידה איטלקית עשירה בטעם שוקולד כהה אינטנסיבי. לחובבי שוקולד אמיתיים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 112,
			name: 'גלידת תות שמנת',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת תות שמנת ביתית קילו - גלידה קרמית עם תותים טריים אמיתיים. גלידה פירותית אהובה על ילדים ומבוגרים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 113,
			name: 'גלידת אוראו',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת אוראו ביתית קילו - גלידה איטלקית קרמית עם פיסות עוגיות אוריאו פריכות. גלידה חגיגית לכל המשפחה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 114,
			name: 'גלידת מנגו',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת מנגו טרופית ביתית קילו - גלידה מרעננת בטעם מנגו טרי ואקזוטי. גלידה קייצית מושלמת לימים חמים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 115,
			name: 'גלידת לימון',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת לימון ביתית קילו - סורבה איטלקי מרענן בטעם לימון חמצמץ וקליל. גלידה קייצית מושלמת לקינוח מרענן. מאפיית מרגליתות בית שמש',
		},
		{
			id: 116,
			name: 'גלידת לוטוס',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת לוטוס ביתית קילו - גלידה קרמית בטעם ביסקוויט לוטוס בלגי עם פיסות עוגיות פריכות. טעם ממכר. מאפיית מרגליתות בית שמש',
		},
		{
			id: 117,
			name: 'גלידת רבע לשבע',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת רבע לשבע ביתית קילו - גלידה נוסטלגית בטעם השוקולד הישראלי האהוב. טעם של ילדות לכל המשפחה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 118,
			name: 'גלידת דובאי',
			category: 'ice-cream',
			price: 130,
			image: '',
			description:
				'גלידת דובאי פרימיום ביתית קילו - גלידה יוקרתית בטעם פיסטוק וקדאיף בהשראה מזרחית. טעם מיוחד וייחודי. מאפיית מרגליתות בית שמש',
		},
		{
			id: 119,
			name: 'גלידת טריפל שוקולד',
			category: 'ice-cream',
			price: 130,
			image: '',
			description:
				'גלידת טריפל שוקולד ביתית קילו - גלידה אינטנסיבית עם 3 סוגי שוקולד עשירים. לחובבי שוקולד אמיתיים בלבד. מאפיית מרגליתות בית שמש',
		},
		{
			id: 120,
			name: 'גלידת פירות יער',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת פירות יער ביתית קילו - גלידה פירותית עם תותים, אוכמניות ופטל טריים. גלידה מרעננת וטעימה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 121,
			name: 'גלידת תפוז',
			category: 'ice-cream',
			price: 120,
			image: '',
			description:
				'גלידת תפוז ביתית קילו - סורבה איטלקי מרענן בטעם תפוז טבעי והדרים. גלידה קייצית קלילה ומרעננת. מאפיית מרגליתות בית שמש',
		},

		// פיצות
		{
			id: 125,
			name: 'פיצה הבית',
			category: 'dairy-meals',
			subcategory: 'pizzas',
			price: 70,
			image: '',
			description:
				'פיצה ביתית איטלקית עם רוטב עגבניות טרי, מוצרלה נמשכת + 2 תוספות לבחירה. בצק טרי יומי אפוי בתנור ביתי. מאפיית מרגליתות בית שמש',
			popular: true,
		},

		// קישים
		{
			id: 130,
			name: 'קיש',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: null,
			image: '',
			description:
				'קיש ביתי טרי בטעמים לבחירה - בטטה, ברוקולי, תרד, פטריות או מנגולד. קיש צרפתי אותנטי מושלם לאירוח, לארוחת בוקר ולשבת. מאפיית מרגליתות בית שמש',
			popular: true,
			hasOptions: true,
			sizes: [
				{ id: 'small', name: 'קטן (14)', price: 110, minQty: 3, note: 'המחיר מותנה בקניית 3' },
				{ id: 'medium', name: 'בינוני (20)', price: 150, minQty: 2, note: 'המחיר מותנה בקניית 2' },
				{ id: 'large', name: 'גדול (24)', price: 180, minQty: 2, note: 'המחיר מותנה בקניית 2' },
			],
			flavors: [
				{ id: 'sweet-potato', name: 'בטטה', icon: '🍠' },
				{ id: 'broccoli', name: 'ברוקולי', icon: '🥦' },
				{ id: 'spinach', name: 'תרד', icon: '🥬' },
				{ id: 'mushrooms', name: 'פטריות', icon: '🍄' },
				{ id: 'mangold', name: 'מנגולד', icon: '🌿' },
			],
		},

		// בורקס
		{
			id: 150,
			name: 'בורקס תפוח אדמה',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 10,
			image: '',
			description:
				'בורקס תפוח אדמה ביתי - בורקס פריך וזהוב במילוי פירה תפו"א קרמי. בורקס טורקי מקורי ליחידה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 151,
			name: 'בורקס גבינה',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 10,
			image: '',
			description:
				'בורקס גבינה ביתי - בורקס פריך במילוי גבינה בולגרית ופטה עשירה. בורקס ישראלי קלאסי בטעם של בית. מאפיית מרגליתות בית שמש',
		},
		{
			id: 152,
			name: 'שבלול פילו גדול',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 170,
			image: '',
			description:
				'שבלול פילו גדול ומרשים במילוי גבינות עשיר - מאפה פילו פריך לאירוח. מתאים לכ-10 מנות, מושלם לארוחת בוקר שישי ושבת. מאפיית מרגליתות בית שמש',
		},

		// פסטות
		{
			id: 160,
			name: 'רביולי אלפרדו',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 150,
			image: '',
			description:
				'רביולי גבינה ברוטב אלפרדו ביתי - 400 גרם פסטה איטלקית ברוטב שמנת ופרמזן קרמי. מתאים לכ-3-5 סועדים. מאפיית מרגליתות בית שמש',
			popular: true,
		},
		{
			id: 161,
			name: 'רביולי עגבניות',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 150,
			image: '',
			description:
				'רביולי גבינה ברוטב עגבניות ביתי - 400 גרם פסטה איטלקית קלאסית ברוטב עגבניות טרי. מתאים לכ-3-5 סועדים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 162,
			name: 'רביולי פסטו',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 150,
			image: '',
			description:
				'רביולי גבינה ברוטב פסטו טרי - 400 גרם פסטה איטלקית ברוטב בזיליקום ואגוזי צנובר. פסטה ירוקה ורעננת. מאפיית מרגליתות בית שמש',
		},

		// מגשי אירועים

		{
			id: 170,
			name: 'קינוחי כוסות מעוצבים',
			category: 'events',
			subcategory: 'events',
			price: 300,
			image: '',
			description:
				'קינוחי כוסות מעוצבים לאירועים - 25 כוסות ב-2-3 טעמים. קינוחים מיני אלגנטיים לבר מתוקים, חתונות, בר/בת מצווה ואירועים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 171,
			name: 'פקעות בוטנים',
			category: 'events',
			subcategory: 'events',
			price: 280,
			image: '',
			description:
				'פקעות בוטנים מרוקאיות מסורתיות - כ-40 יחידות. עוגיות חגיגיות במילוי בוטנים עשיר. מושלם למימונה, לחינה ולאירועים משפחתיים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 172,
			name: 'מקרוד',
			category: 'events',
			subcategory: 'events',
			price: 240,
			image: '',
			description:
				'מקרוד מרוקאי מסורתי - כ-30 יחידות. עוגיות סולת ממולאות תמרים, מטוגנות וטבולות בדבש טבעי. קינוח מסורתי למימונה ולחגים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 173,
			name: 'אצבעות פילו שקדים בדבש',
			category: 'events',
			subcategory: 'events',
			price: 200,
			image: '',
			description:
				'אצבעות פילו פריכות בדבש - כ-20 יחידות. אצבעות פילו זהובות במילוי שקדים וסירופ דבש עשיר. קינוח מזרחי מפנק לאירועים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 174,
			name: 'סיגר מטוגן במילוי שקדים',
			category: 'events',
			subcategory: 'events',
			price: 190,
			image: '',
			description:
				'סיגרים מרוקאיים במילוי שקדים - כ-30 יחידות. סיגרי פילו מטוגנים זהובים במילוי שקדים קלויים. קינוח חגיגי למימונה ולאירועים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 175,
			name: 'סיגר מטוגן במילוי פיסטוקים',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '',
			description:
				'סיגרים מרוקאיים פרימיום במילוי פיסטוק - כ-30 יחידות. סיגרי פילו יוקרתיים במילוי פיסטוק איכותי. קינוח מיוחד לאירועים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 176,
			name: 'סיגר מטוגן במילוי אגוזים',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '',
			description:
				'סיגרים מרוקאיים במילוי אגוזי מלך - כ-30 יחידות. סיגרי פילו מטוגנים במילוי אגוזים עשירים. קינוח מסורתי לחגים ולמימונה. מאפיית מרגליתות בית שמש',
		},
		{
			id: 177,
			name: 'ספינג',
			category: 'events',
			subcategory: 'events',
			price: 180,
			image: '',
			description:
				'מגש ספינג מרוקאי מסורתי - כ-32 יחידות. כדורי בצק מטוגנים זהובים בסירופ דבש מתוק. קינוח מסורתי לחנוכה, למימונה ולאירועים. מאפיית מרגליתות בית שמש',
		},
		{
			id: 178,
			name: 'באקלאווה',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '',
			description:
				'באקלאווה ביתית מסורתית - כ-30 יחידות. שכבות פילו פריכות במילוי אגוזים וסירופ דבש עשיר. קינוח מזרחי קלאסי לאירועים ולחגים. מאפיית מרגליתות בית שמש',
		},

		// עוגות יום הולדת ואירועים

		{
			id: 190,
			name: 'עוגת יום הולדת קלאסית',
			category: 'birthday-cakes',
			price: 180,
			image: '',
			description:
				'עוגת יום הולדת קלאסית - עוגת שכבות עם קרם וניל ופירות טריים. עוגה ל-10 מנות מושלמת לימי הולדת לילדים ולמבוגרים. הזמנת עוגות בבית שמש - מאפיית מרגליתות',
			popular: true,
		},
		{
			id: 191,
			name: 'עוגת שוקולד ליום הולדת',
			category: 'birthday-cakes',
			price: 200,
			image: '',
			description:
				'עוגת שוקולד ליום הולדת - עוגת שכבות שוקולד עשירה עם גנאש בלגי. עוגה ל-10 מנות לאוהבי שוקולד. הזמנת עוגות יום הולדת בבית שמש - מאפיית מרגליתות',
			popular: true,
		},
		{
			id: 192,
			name: 'עוגת ממתקים',
			category: 'birthday-cakes',
			price: 350,
			image: '',
			description:
				'עוגת ממתקים מעוצבת - עוגה צבעונית מכוסה בממתקים וסוכריות. עוגה מרשימה ומושכת עין ליום הולדת לילדים. הזמנת עוגות מעוצבות בבית שמש - מאפיית מרגליתות',
		},
		{
			id: 193,
			name: 'עוגת טו בשבט מעוצבת',
			category: 'birthday-cakes',
			price: 250,
			image: '',
			description:
				'עוגת טו בשבט מעוצבת - עוגת שוקולד בעיצוב פירות וטבע לחג האילנות. עוגה חגיגית לגנים, לכיתות ולמשפחות. הזמנת עוגות לחגים בבית שמש - מאפיית מרגליתות',
		},
		{
			id: 194,
			name: 'עוגת מספר',
			category: 'birthday-cakes',
			price: 220,
			image: '',
			description:
				'עוגת מספר מעוצבת - עוגה בצורת מספר הגיל עם קרם, פירות ומקרונים. עוגת יום הולדת אינסטגרמית ומרשימה. הזמנת עוגות מספר בבית שמש - מאפיית מרגליתות',
			popular: true,
		},
		{
			id: 195,
			name: 'עוגת בת/בר מצווה',
			category: 'birthday-cakes',
			price: 350,
			image: '',
			description:
				'עוגת בר מצווה / בת מצווה מעוצבת - עוגה ל-20 מנות בעיצוב אישי מרשים. עוגה חגיגית לאירוע המשפחתי הגדול. הזמנת עוגות לבר מצווה בבית שמש - מאפיית מרגליתות',
		},
		{
			id: 196,
			name: 'עוגת חתונה/אירוסין',
			category: 'birthday-cakes',
			price: 500,
			image: '',
			description:
				'עוגת חתונה או אירוסין מעוצבת - עוגת קומות יוקרתית ל-30 מנות. עיצוב רומנטי ואלגנטי לפי בקשה. הזמנת עוגות חתונה בבית שמש - מאפיית מרגליתות',
		},
		{
			id: 197,
			name: 'קאפקייקס מעוצבים (12 יח)',
			category: 'birthday-cakes',
			price: 120,
			image: '',
			description:
				'קאפקייקס מעוצבים - 12 יחידות בעיצוב לפי נושא לבחירה. קאפקייקס ליום הולדת, למסיבות ולאירועים. צבעים ועיצוב אישי. מאפיית מרגליתות בית שמש',
		},
		{
			id: 198,
			name: 'עוגת גבינה ליום הולדת',
			category: 'birthday-cakes',
			price: 160,
			image: '',
			description:
				'עוגת גבינה ליום הולדת - עוגת גבינה אפויה קרמית ל-10 מנות עם ציפוי פירות טריים. עוגה קלילה לאוהבי גבינה. הזמנת עוגות בבית שמש - מאפיית מרגליתות',
		},
		{
			id: 199,
			name: 'עוגה מעוצבת בהתאמה אישית',
			category: 'birthday-cakes',
			price: 250,
			image: '',
			description:
				'עוגה מעוצבת בהתאמה אישית - עוגה בעיצוב ייחודי לפי דמיון ובקשה. צרו קשר לתיאום פרטים, טעמים ועיצוב. הזמנת עוגות מיוחדות בבית שמש - מאפיית מרגליתות',
			popular: true,
		},
	]);

	// ===== GETTERS =====

	// Get products by category (תומך גם במערך קטגוריות וגם בקטגוריה בודדת)
	const getProductsByCategory = computed(() => {
		return categoryId =>
			products.value.filter(p => {
				// בדוק אם category הוא מערך
				if (Array.isArray(p.category)) {
					return p.category.includes(categoryId);
				}
				// קטגוריה בודדת
				return p.category === categoryId;
			});
	});

	// Get products by subcategory (for dairy meals)
	const getProductsBySubcategory = computed(() => {
		return subcategoryId => products.value.filter(p => p.subcategory === subcategoryId);
	});

	// Get popular products from a category (limit)
	const getPopularByCategory = computed(() => {
		return (categoryId, limit = 4) => {
			const categoryProducts = products.value.filter(p => {
				if (Array.isArray(p.category)) {
					return p.category.includes(categoryId);
				}
				return p.category === categoryId;
			});
			const popular = categoryProducts.filter(p => p.popular);
			const others = categoryProducts.filter(p => !p.popular);
			return [...popular, ...others].slice(0, limit);
		};
	});

	// Get all popular products
	const popularProducts = computed(() => {
		return products.value.filter(p => p.popular);
	});

	// Get preview for homepage (4-5 items from each category)
	const getCategoryPreview = computed(() => {
		return categories.value.map(category => ({
			...category,
			products: getPopularByCategory.value(category.id, 5),
		}));
	});

	// חיפוש מוצרים
	function searchProducts(query) {
		if (!query || query.trim() === '') return [];

		const searchTerm = query.trim().toLowerCase();

		return products.value
			.filter(product => {
				// דלג על מוצרים מחוגי אפייה
				const productCategories = product.categories || [product.category];
				if (productCategories.includes('baking-workshops')) return false;

				// חפש בשם המוצר או בתיאור
				return (
					product.name.toLowerCase().includes(searchTerm) ||
					(product.description && product.description.toLowerCase().includes(searchTerm))
				);
			})
			.map(product => {
				const category = categories.value.find(c => c.id === product.category);
				return {
					...product,
					categoryId: product.category,
					categoryName: category?.name || '',
				};
			});
	}

	// קבלת קטגוריה לפי ID
	function getCategoryById(categoryId) {
		return categories.value.find(cat => cat.id === categoryId);
	}

	// קבלת מוצר לפי ID
	function getProductById(productId) {
		const product = products.value.find(p => p.id === productId);
		if (product) {
			return {
				...product,
				categoryId: product.category,
			};
		}
		return null;
	}

	return {
		categories,
		products,
		dairySubcategories,
		getProductsByCategory,
		getProductsBySubcategory,
		getPopularByCategory,
		popularProducts,
		getCategoryPreview,
		searchProducts,
		getCategoryById,
		getProductById,
	};
});
