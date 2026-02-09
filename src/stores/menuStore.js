import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMenuStore = defineStore('menu', () => {
	// ===== CATEGORIES =====
	const categories = ref([
		{
			id: 'yeast-cakes',
			name: 'עוגות שמרים',
			image: '/cakes/shmarim/Choclate.png',
			hoverImage: '/cakes/shmarim/cinemonCranch.png',
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
			image: '/cakes/maple.jpg',
			hoverImage: '/cakes/lemonCake.png',
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
			image: '/cakes/chocletCookies.jpg',
			hoverImage: '',
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
			image: '',
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
			image: '',
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
			price: 50,
			image: '/cakes/shmarim/Choclate.png',
			description: 'עוגת שמרים עם שכבות שוקולד עשיר',
			popular: true,
		},
		{
			id: 2,
			name: 'שמרים קינמון',
			category: 'yeast-cakes',
			price: 50,
			image: '/cakes/shmarim/cinemonCranch.png',
			description: 'עוגת שמרים עם קינמון וסוכר חום',
		},
		{
			id: 3,
			name: 'קראנץ גבינה',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/chease.jpg',
			description: 'עוגת שמרים במילוי גבינה מתוקה',
			popular: true,
		},
		{
			id: 4,
			name: 'קראנץ תפוחים',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/apple.jpeg',
			description: 'עוגת שמרים במילוי תפוח',
			popular: true,
		},
		{
			id: 5,
			name: 'שמרים שוקולד חלב',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/Choclate.png',
			description: 'עוגת שמרים עם שכבות שוקולד חלבי',
		},
		{
			id: 6,
			name: 'שמרים פרג',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/cinamen.png',
			description: 'עוגת שמרים עם מילוי פרג מסורתי',
		},
		{
			id: 7,
			name: 'שמרים טבלת שוקולד',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/shmarim.jpg',
			description: 'עוגת שמרים עם מילוי שוקולד אמיתי',
		},
		{
			id: 8,
			name: 'שמרים תותים וקוקוס',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/cinamen.png',
			description: 'עוגת שמרים עם מילוי תותים וקוקוס',
		},
		{
			id: 9,
			name: 'שמרים ללא סוכר',
			category: ['yeast-cakes', 'sugar-free'],
			price: 60,
			image: '/cakes/shmarim/chocolate2.png',
			description: 'עוגת שמרים ללא סוכר',
		},
		{
			id: 10,
			name: 'חלבה שוקולד',
			category: 'yeast-cakes',
			price: 50,
			image: '/cakes/shmarim/cinamen.png',
			description: 'עוגת שמרים עם מילוי חלבה שוקולד',
		},
		{
			id: 11,
			name: 'שמרים בטעם נוטלה',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/Choclate.png',
			description: 'עוגת שמרים עם מילוי בטעם נוטלה',
		},
		{
			id: 12,
			name: 'רוגלך שוקולד/קינמון',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/cinimonRogalach.jpg',
			description: 'רוגלך שוקולד/קינמון',
		},
		{
			id: 13,
			name: 'שבלולי קינמון/שוקולד',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/cinamonSnails.png',
			description: 'שבלולי קינמון/שוקולד',
		},
		{
			id: 14,
			name: 'שושני גבינה',
			category: 'yeast-cakes',
			price: 50,
			image: '/cakes/shmarim/CheaseSnails.png',
			description: 'שושני גבינה',
		},
		{
			id: 15,
			name: 'קוראסון שוקולד אמיתי',
			category: 'yeast-cakes',
			price: 55,
			image: '/cakes/shmarim/ChocletCroson.jpg',
			description: 'קוראסון שוקולד אמיתי',
		},

		// עוגות בחושות
		{
			id: 17,
			name: 'פס שוקולד עשיר',
			category: 'mixed-cakes',
			price: 45,
			image: '',
			description: 'עוגת שוקולד כהה עשירה ולחה',
			popular: true,
		},
		{
			id: 18,
			name: 'מאפינס אוכמניות',
			category: 'mixed-cakes',
			price: 55,
			image: '/cakes/bluberymafins.png',
			description: 'מאפינס אוכמניות מארז 5 יחידות',
		},
		{
			id: 19,
			name: 'בראוניז שוקולד גבינה',
			category: 'mixed-cakes',
			price: 65,
			image: '/cakes/cheseBrounies.png',
			description: 'בראוניז שוקולד גבינה',
		},
		{
			id: 20,
			name: 'פס לימון',
			category: 'mixed-cakes',
			price: 45,
			image: '/cakes/lemonCake.png',
			description: 'עוגת לימון',
		},
		{
			id: 21,
			name: 'סולת תפוז',
			category: 'mixed-cakes',
			price: 45,
			image: '/cakes/milchikSoletTapuz.png',
			description: 'עוגת סולת תפוז חלבית',
		},
		{
			id: 22,
			name: 'עוגת פירות יבשים',
			category: 'mixed-cakes',
			price: 70,
			image: '/cakes/drayedFruits.png',
			description: 'עוגת פירות יבשים',
		},
		{
			id: 23,
			name: 'קראמבל קפה',
			category: 'mixed-cakes',
			price: 80,
			image: '/cakes/cafeCrambelNuts.png',
			description: 'עוגת קראמבל קפה',
		},
		{
			id: 24,
			name: 'פאי פיצוחים',
			category: 'mixed-cakes',
			price: 80,
			image: '/cakes/payPitzuchim.png',
			description: 'פאי פיצוחים',
		},
		{
			id: 25,
			name: 'גבינה אוכמניות',
			category: 'mixed-cakes',
			price: 180,
			image: '/cakes/cheaseBloberyes.png',
			description: 'עוגת גבינה אוכמניות קוטר 24',
		},
		{
			id: 26,
			name: 'עוגה אנגלית חלבית',
			category: 'mixed-cakes',
			price: 55,
			image: '/cakes/englishcake.png',
			description: 'עוגה אנגלית חלבית עם קליפות הדרים',
		},
		{
			id: 27,
			name: 'מייפל אגוזים',
			category: 'mixed-cakes',
			price: 50,
			image: '/cakes/maple.jpg',
			description: 'עוגת מייפל אגוזים',
		},
		{
			id: 28,
			name: 'מייפל טבעי ואגוזים',
			category: 'mixed-cakes',
			price: 55,
			image: '/cakes/maple.jpg',
			description: 'עוגת מייפל אגוזים עם מייפל טבעי',
		},
		{
			id: 29,
			name: 'עוגת טו בשבט',
			category: 'mixed-cakes',
			price: 70,
			image: '/cakes/tubeshvatcake.jpg',
			description: 'עוגת שוקולד מעוצבת טו בשבט',
		},
		{
			id: 30,
			name: 'דמקה שכבות גבינה',
			category: 'mixed-cakes',
			price: 80,
			image: '/cakes/damkaCake.png',
			description: 'עוגת דמקה שכבות גבינה',
		},
		{
			id: 31,
			name: 'פס גבינה פירורים',
			category: 'mixed-cakes',
			price: 60,
			image: '/cakes/chesecake.png',
			description: 'עוגת גבינה פירורים',
		},
		{
			id: 32,
			name: 'עוגת גבינה קרה',
			category: 'mixed-cakes',
			price: 50,
			image: '/cakes/cheseChoclateCake.png',
			description: 'עוגת גבינה קרה בציפוי גנאש שוקולד',
		},
		{
			id: 34,
			name: 'גבינה אוריאו',
			category: 'mixed-cakes',
			price: 180,
			image: '/cakes/oreocheasecake.png',
			description: 'עוגת גבינה אוריאו קוטר 24',
		},
		{
			id: 35,
			name: 'סופלה שוקולד',
			category: 'mixed-cakes',
			price: 45,
			image: '/cakes/sofle.png',
			description: 'סופלה שוקולד איכותי - מארז חמישייה',
		},
		{
			id: 36,
			name: 'בראוניז',
			category: 'mixed-cakes',
			price: 45,
			image: '/cakes/brounies.jpg',
			description: 'בראוניז',
		},

		// עוגיות
		{
			id: 41,
			name: "מופלאות שוקולד צ'יפס",
			category: 'cookies',
			price: 55,
			image: '/cookies/choclatechips.jpg',
			description: "מופלאות שוקולד צ'יפס חום או לבן",
			popular: true,
		},
		{
			id: 43,
			name: "שוקולד צ'יפס תות מקורי",
			category: 'cookies',
			price: 65,
			image: '/cookies/choclatechips.jpg',
			description: "שוקולד צ'יפס תות מקורי",
			popular: true,
		},
		{ id: 45, name: 'עוגיות חמאה פקאן', category: 'cookies', price: 65, image: '', description: 'עוגיות חמאה פקאן' },
		{ id: 46, name: 'סהרוני שקדים', category: 'cookies', price: 65, image: '', description: 'סהרוני שקדים פריכות' },
		{
			id: 47,
			name: 'עוגיות בריאות',
			category: 'cookies',
			price: 60,
			image: '',
			description: 'עוגיות בריאות',
		},
		{
			id: 48,
			name: 'פרח ריבה',
			category: 'cookies',
			price: 60,
			image: '',
			description: 'עוגיות פרח ריבה',
			popular: true,
		},
		{
			id: 49,
			name: 'מגולגלות תמרים ללא סוכר',
			category: ['cookies', 'sugar-free'],
			price: 55,
			image: '',
			description: 'מגולגלות תמרים ללא סוכר פריך מאוד',
		},
		{ id: 50, name: 'קוקילידה', category: 'cookies', price: 14, image: '', description: 'קוקילידה' },
		{ id: 51, name: 'חיתוכיות תות תפוח', category: 'cookies', price: 60, image: '', description: 'חיתוכיות תות תפוח' },
		{ id: 52, name: 'עוגיות לוקום', category: 'cookies', price: 60, image: '', description: 'עוגיות רחת לוקום' },
		{
			id: 53,
			name: 'עוגיות קוקוס ושוקולד',
			category: 'cookies',
			price: 50,
			image: '',
			description: 'עוגיות קוקוס ושוקולד',
		},
		// { id: 54, name: 'עוגיות מרוקאיות', category: 'cookies', price: 50, image: '', description: 'עוגיות מרוקאיות' },
		{ id: 55, name: 'שומשומיות', category: 'cookies', price: 50, image: '', description: 'שומשומיות' },
		{ id: 56, name: 'ריפאת', category: 'cookies', price: 50, image: '', description: 'ריפאת' },
		{
			id: 57,
			name: 'אצבעות פילו במגוון מילויים',
			category: 'cookies',
			price: 50,
			image: '',
			description: '5 אצבעות פילו חלבה/שקדים/אגוזים בזיגוג מייפל או סילאן',
		},
		{ id: 58, name: 'לימוניות', category: 'cookies', price: 50, image: '', description: 'עוגיות לימון' },
		{ id: 59, name: 'עוגיות קפה ארומטיות', category: 'cookies', price: 50, image: '', description: 'עוגיות קפה' },
		{ id: 60, name: 'מושלגות פרג', category: 'cookies', price: 50, image: '', description: 'עוגיות פרג' },
		{ id: 61, name: 'מגולגלות חלבה', category: 'cookies', price: 55, image: '', description: 'מגולגלות חלבה' },
		{
			id: 62,
			name: 'עוגיות אגוזים קינמון',
			category: 'cookies',
			price: 60,
			image: '',
			description: 'עוגיות אגוזים קינמון',
		},
		// {
		// 	id: 63,
		// 	name: 'מגולגלות תמרים כוסמין ללא סוכר',
		// 	category: ['cookies', 'sugar-free'],
		// 	price: 65,
		// 	image: '',
		// 	description: 'מגולגלות תמרים מקמח כוסמין 80% ללא סוכר פריך מאוד',
		// },
		{
			id: 64,
			name: 'חיתוכיות חמאת בוטנים',
			category: 'cookies',
			price: 45,
			image: '',
			description: 'חיתוכיות חמאת בוטנים ושוקולד',
		},

		// לחמים
		{
			id: 70,
			name: 'מארז לחמניות הבית לבן',
			category: 'breads',
			price: 25,
			image: '',
			description: 'לחמניות קמח לבן (5 יח)',
			popular: true,
		},
		{ id: 71, name: 'חלה', category: 'breads', price: 20, image: '', description: 'חלה לשבת' },
		{
			id: 72,
			name: 'מארז לחמניות הבית כוסמין 80%',
			category: 'breads',
			price: 35,
			image: '/bread/rolls.png',
			description: 'לחמניות כוסמין 80% (5 יח)',
		},
		{
			id: 73,
			name: 'חלת כוסמין 80%',
			category: 'breads',
			price: 35,
			image: '/bread/chalaKosmin3.png',
			description: 'חלת כוסמין 80%',
		},
		{
			id: 74,
			name: 'לחמניות שום כוסמין 80%',
			category: 'breads',
			price: 9,
			image: '/bread/garlicRolls.png',
			description: "לחמניות שום כוסמין 80% (6 יח')",
		},
		{ id: 75, name: 'פיתות זעתר ושומשום', category: 'breads', price: 12, image: '', description: 'פיתות זעתר ושומשום' },
		{
			id: 76,
			name: 'לחמניות שום',
			category: 'breads',
			price: 7,
			image: '/bread/garlicBread1.png',
			description: 'לחמניות שום',
		},
		{
			id: 77,
			name: 'לחמניות מתוקות',
			category: 'breads',
			price: 10,
			image: '/bread/sweetRools.png',
			description: 'לחמניות מתוקות עם צימוקים',
		},

		// ללא סוכר
		{
			id: 81,
			name: 'עוגיות שיבולת שועל ללא סוכר',
			category: ['cookies', 'sugar-free'],
			price: 50,
			image: '',
			description: 'עוגיות בריאות עם דבש',
		},
		{
			id: 83,
			name: 'עוגת גבינה ללא סוכר',
			category: ['cakes', 'sugar-free'],
			price: 100,
			image: '',
			description: 'עוגת גבינה ללא סוכר',
		},

		// ללא גלוטן
		{
			id: 90,
			name: 'עוגת שוקולד ללא גלוטן',
			category: ['gluten-free', 'cakes'],
			price: 100,
			image: '',
			description: 'עוגת שוקולד עשירה מקמח שקדים',
			popular: true,
		},
		{
			id: 91,
			name: 'עוגיות קוקוס ללא גלוטן',
			category: ['gluten-free', 'cookies'],
			price: 55,
			image: '',
			description: 'עוגיות קוקוס ללא גלוטן',
		},
		{
			id: 92,
			name: 'עוגת גבינה ללא גלוטן',
			category: ['gluten-free', 'cakes'],
			price: 110,
			image: '',
			description: 'עוגת גבינה ללא גלוטן',
		},

		// טבעוני
		{
			id: 99,
			name: 'עוגת שוקולד טבעונית',
			category: ['vegan', 'cakes'],
			price: 95,
			image: '',
			description: 'עוגת שוקולד ללא ביצים וחלב',
			popular: true,
		},
		{
			id: 100,
			name: 'עוגיות טבעוניות',
			category: ['vegan', 'cookies'],
			price: 50,
			image: '',
			description: "עוגיות שוקולד צ'יפס טבעוניות",
		},
		{
			id: 101,
			name: 'מאפינס טבעוניים',
			category: ['vegan', 'cakes'],
			price: 55,
			image: '',
			description: 'מאפינס אוכמניות טבעוניים',
		},
		{
			id: 102,
			name: 'לחם טבעוני',
			category: ['vegan', 'breads'],
			price: 35,
			image: '',
			description: 'לחם ביתי ללא מוצרי חלב',
		},

		// גלידות
		{
			id: 110,
			name: 'גלידת וניל',
			category: ['ice-cream', 'gluten-free'],
			price: 130,
			image: '',
			description: 'גלידת וניל קלאסית ביתית קילו',
			popular: true,
		},
		{
			id: 111,
			name: 'גלידת שוקולד בלגי',
			category: 'ice-cream',
			price: 130,
			image: '',
			description: 'גלידת שוקולד בלגי עשיר',
		},
		{
			id: 112,
			name: 'גלידת תות שמנת',
			category: 'ice-cream',
			price: 130,
			image: '',
			description: 'גלידת תות עם פירות טריים קילו',
		},
		{
			id: 113,
			name: 'גלידת פיסטוק',
			category: 'ice-cream',
			price: 130,
			image: '',
			description: 'גלידת פיסטוק איטלקית קילו',
		},
		{ id: 114, name: 'גלידת מנגו', category: 'ice-cream', price: 130, image: '', description: 'גלידת מנגו טרופית קילו' },
		{ id: 115, name: 'סורבה לימון', category: 'ice-cream', price: 130, image: '', description: 'סורבה לימון מרעננת קילו' },

		// ארוחות חלביות - פיצות
		{
			id: 120,
			name: 'פיצה מהחלומות',
			category: 'dairy-meals',
			subcategory: 'pizzas',
			price: 70,
			image: '',
			description: 'פיצה עם רוטב עגבניות ומוצרלה ו2 תוספות',
			popular: true,
		},
		{
			id: 121,
			name: 'פיצה ללא גלוטן',
			category: 'dairy-meals',
			subcategory: ['pizzas', 'gluten-free'],
			price: 90,
			image: '',
			description: 'פיצה ללא גלוטן עם רוטב עגבניות ומוצרלה ו2 תוספות',
			popular: true,
		},

		// ארוחות חלביות - קישים
		{
			id: 130,
			name: 'קיש בטטה גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '',
			description: 'קיש בטטה גדול עם 3 תוספות',
			popular: true,
		},
		{
			id: 131,
			name: 'קיש בטטה קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '',
			description: 'קיש בטטה קטן',
		},
		{
			id: 132,
			name: 'קיש ברוקולי גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '',
			description: 'קיש ברוקולי גדול',
		},
		{
			id: 133,
			name: 'קיש ברוקולי קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '',
			description: 'קיש ברוקולי קטן',
		},
		{
			id: 134,
			name: 'קיש תרד גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '',
			description: 'קיש תרד גדול עם 3 תוספות',
			popular: true,
		},
		{
			id: 135,
			name: 'קיש תרד קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '',
			description: 'קיש תרד קטן',
		},
		{
			id: 136,
			name: 'קיש פטריות גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '',
			description: 'קיש פטריות גדול',
		},
		{
			id: 137,
			name: 'קיש פטריות קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '',
			description: 'קיש פטריות קטן',
		},
		{
			id: 138,
			name: 'קיש מנגולד גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '',
			description: 'קיש מנגולד גדול',
		},
		{
			id: 139,
			name: 'קיש מנגולד קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '',
			description: 'קיש מנגולד קטן',
		},

		// ארוחות חלביות - בורקס
		{
			id: 150,
			name: 'בורקס תפוח אדמה',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 10,
			image: '',
			description: 'בורקס תפוח אדמה',
		},
		{
			id: 151,
			name: 'בורקס גבינה',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 10,
			image: '',
			description: 'בורקס גבינה',
		},
		{
			id: 152,
			name: 'שבלול פילו גדול',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 170,
			image: '',
			description: 'שבלול פילו גדול',
		},

		// ארוחות חלביות - פסטות
		{
			id: 160,
			name: 'רביולי אלפרדו',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 150,
			image: '',
			description: 'רביולי ברוטב שמנת ופרמזן 400 גרם',
			popular: true,
		},
		{
			id: 161,
			name: 'רביולי עגבניות',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 150,
			image: '',
			description: 'רביולי ברוטב עגבניות ביתי 400 גרם מתאים לכ3-5 סועדים',
		},
		{
			id: 162,
			name: 'רביולי פסטו',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 150,
			image: '',
			description: 'רביולי ברוטב פסטו טרי',
		},

		// מגשי אירועים
		{
			id: 170,
			name: 'קינוחי כוסות מעוצבים',
			category: 'events',
			subcategory: 'events',
			price: 300,
			image: '',
			description: 'קינוחי כוסות מעוצבים 25 כוסות ב2-3 טעמים',
		},
		{
			id: 171,
			name: 'פקעות בוטנים',
			category: 'events',
			subcategory: 'events',
			price: 280,
			image: '',
			description: 'פקעות בוטנים כ40 יחידות',
		},
		{
			id: 172,
			name: 'מקרוד',
			category: 'events',
			subcategory: 'events',
			price: 240,
			image: '',
			description: 'מקרוד עוגיות מבצק סולת ממולא תמרים מטוגנות וטבולות בדבש כ30 יחידות',
		},
		{
			id: 173,
			name: 'אצבעות פילו שקדים בדבש',
			category: 'events',
			subcategory: 'events',
			price: 200,
			image: '',
			description: 'אצבעות פילו שקדים בדבש כ20 יחידות',
		},
		{
			id: 174,
			name: 'סיגר מטוגן במילוי שקדים',
			category: 'events',
			subcategory: 'events',
			price: 190,
			image: '',
			description: 'סיגר מטוגן במילוי שקדים כ30 יחידות',
		},
		{
			id: 175,
			name: 'סיגר מטוגן במילוי פיסטוקים',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '',
			description: 'סיגר מטוגן במילוי פיסטוקים כ30 יחידות',
		},
		{
			id: 176,
			name: 'סיגר מטוגן במילוי אגוזים',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '',
			description: 'סיגר מטוגן במילוי אגוזים כ30 יחידות',
		},
		{
			id: 177,
			name: 'ספינג',
			category: 'events',
			subcategory: 'events',
			price: 180,
			image: '',
			description: 'מגש ספינג כ32 יחידות',
		},
		{
			id: 178,
			name: 'באקלאווה',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '',
			description: 'באקלאווה כ30 יחידות',
		},

		// עוגות יום הולדת ואירועים
		{
			id: 190,
			name: 'עוגת יום הולדת קלאסית',
			category: 'birthday-cakes',
			price: 180,
			image: '',
			description: 'עוגת שכבות עם קרם וניל ופירות - 10 מנות',
			popular: true,
		},
		{
			id: 191,
			name: 'עוגת שוקולד ליום הולדת',
			category: 'birthday-cakes',
			price: 200,
			image: '',
			description: 'עוגת שכבות שוקולד עשירה עם גנאש - 10 מנות',
			popular: true,
		},
		{
			id: 192,
			name: 'עוגת ממתקים',
			category: 'birthday-cakes',
			price: 350,
			image: '',
			description: 'עוגת ממתקים',
		},
		{
			id: 193,
			name: 'עוגת טו בשבט מעוצבת',
			category: 'birthday-cakes',
			price: 250,
			image: '',
			description: 'עוגת שוקולד מעוצבת לטו בשבט',
		},
		{
			id: 194,
			name: 'עוגת מספר',
			category: 'birthday-cakes',
			price: 220,
			image: '',
			description: 'עוגה בצורת מספר עם קרם ופירות',
			popular: true,
		},
		{
			id: 195,
			name: 'עוגת בת/בר מצווה',
			category: 'birthday-cakes',
			price: 350,
			image: '',
			description: 'עוגה מעוצבת לבר/בת מצווה - 20 מנות',
		},
		{
			id: 196,
			name: 'עוגת חתונה/אירוסין',
			category: 'birthday-cakes',
			price: 500,
			image: '',
			description: 'עוגת קומות מעוצבת לאירוע - 30 מנות',
		},
		{
			id: 197,
			name: 'קאפקייקס מעוצבים (12 יח)',
			category: 'birthday-cakes',
			price: 120,
			image: '',
			description: 'קאפקייקס מעוצבים לפי נושא',
		},
		{
			id: 198,
			name: 'עוגת גבינה ליום הולדת',
			category: 'birthday-cakes',
			price: 160,
			image: '',
			description: 'עוגת גבינה אפויה עם ציפוי פירות - 10 מנות',
		},
		{
			id: 199,
			name: 'עוגה מעוצבת בהתאמה אישית',
			category: 'birthday-cakes',
			price: 250,
			image: '',
			description: 'עוגה בעיצוב אישי לפי בקשה - צרו קשר לתיאום',
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
