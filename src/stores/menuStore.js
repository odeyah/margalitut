import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMenuStore = defineStore('menu', () => {
	// ===== CATEGORIES =====
	const categories = ref([
		{
			id: 'yeast-cakes',
			name: 'עוגות שמרים',
			icon: '🥐',
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
			icon: '🍰',
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
			icon: '🍪',
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
			icon: '🍞',
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
			icon: '🌿',
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
			icon: '🌾',
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
			icon: '🌱',
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
			icon: '🍦',
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
			icon: '🧀',
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
			id: 'baking-workshops',
			name: 'חוגי אפייה',
			icon: '👩‍🍳',
			color: '#d34a6e',
			description: 'חוגי אפייה לילדים בכל הגילאים',
			isExternal: false,
		},
	]);

	// ===== DAIRY MEALS SUBCATEGORIES =====
	const dairySubcategories = ref([
		{ id: 'pizzas', name: 'פיצות', icon: '🍕' },
		{ id: 'quiches', name: 'קישים', icon: '🥧' },
		{ id: 'salads', name: 'סלטים', icon: '🥗' },
		{ id: 'pastas', name: 'פסטות', icon: '🍝' },
		{ id: 'soups', name: 'מרקים', icon: '🍲' },
	]);

	// ===== PRODUCTS =====
	const products = ref([
		// עוגות שמרים
		{
			id: 1,
			name: 'עוגת שמרים שוקולד',
			category: 'yeast-cakes',
			price: 50,
			image: '🥐',
			description: 'עוגת שמרים עם שכבות שוקולד עשיר',
			popular: true,
		},
		{
			id: 2,
			name: 'עוגת שמרים קינמון',
			category: 'yeast-cakes',
			price: 50,
			image: '🥐',
			description: 'עוגת שמרים עם קינמון וסוכר חום',
		},
		{
			id: 3,
			name: 'עוגת שמרים קראנץ גבינה',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'עוגת שמרים במילוי גבינה מתוקה',
			popular: true,
		},
		{
			id: 4,
			name: 'עוגת שמרים שוקולד חלבי',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'עוגת שמרים עם שכבות שוקולד חלבי',
		},
		{
			id: 5,
			name: 'עוגת שמרים פרג',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'עוגת שמרים עם מילוי פרג מסורתי',
		},
		{
			id: 6,
			name: 'עוגת שמרים שוקולד אמיתי',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'עוגת שמרים עם מילוי שוקולד אמיתי',
		},
		{
			id: 7,
			name: 'עוגת שמרים תות קוקוס',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'עוגת שמרים עם מילוי תות קוקוס',
		},
		{
			id: 8,
			name: 'עוגת שמרים ללא סוכר',
			category: 'yeast-cakes',
			price: 60,
			image: '🥐',
			description: 'עוגת שמרים ללא סוכר',
		},
		{
			id: 9,
			name: 'עוגת שמרים חלבה',
			category: 'yeast-cakes',
			price: 50,
			image: '🥐',
			description: 'עוגת שמרים עם מילוי חלבה',
		},
		{
			id: 10,
			name: 'עוגת שמרים בטעם נוטלה',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'עוגת שמרים עם מילוי בטעם נוטלה',
		},
		{
			id: 11,
			name: 'רוגלך שוקולד/קינמון',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'רוגלך שוקולד/קינמון',
		},
		{
			id: 12,
			name: 'שבלולי שוקולד/קינמון',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'שבלולי שוקולד/קינמון',
		},
		{
			id: 12,
			name: 'קוראסון שוקולד אמיתי',
			category: 'yeast-cakes',
			price: 55,
			image: '🥐',
			description: 'קוראסון שוקולד אמיתי',
		},

		// עוגות בחושות
		{
			id: 13,
			name: 'עוגת שוקולד עשירה',
			category: 'mixed-cakes',
			price: 45,
			image: '🍫',
			description: 'עוגת שוקולד כהה עשירה ולחה',
			popular: true,
		},
		{
			id: 14,
			name: 'עוגת וניל',
			category: 'mixed-cakes',
			price: 45,
			image: '🍰',
			description: 'עוגת וניל',
			popular: true,
		},
		{
			id: 15,
			name: 'עוגת שיש',
			category: 'mixed-cakes',
			price: 45,
			image: '🥕',
			description: 'עוגת שיש',
		},
		{
			id: 16,
			name: 'עוגת תפוזים',
			category: 'mixed-cakes',
			price: 45,
			image: '🍎',
			description: 'עוגת תפוזים',
		},
		{
			id: 17,
			name: 'עוגת לימון',
			category: 'mixed-cakes',
			price: 45,
			image: '🍋',
			description: 'עוגת לימון',
		},
		{
			id: 18,
			name: 'עוגת קוקוס',
			category: 'mixed-cakes',
			price: 45,
			image: '🥥',
			description: 'עוגת קוקוס',
		},
		{
			id: 19,
			name: 'עוגת קפה',
			category: 'mixed-cakes',
			price: 45,
			image: '☕',
			description: 'עוגת קפה',
		},
		{
			id: 20,
			name: 'עוגת דבש',
			category: 'mixed-cakes',
			price: 45,
			image: '🍯',
			description: 'עוגת דבש',
		},
		{
			id: 21,
			name: 'עוגת סולת תפוזים',
			category: 'mixed-cakes',
			price: 45,
			image: '🍊',
			description: 'עוגת סולת תפוזים',
		},
		{
			id: 22,
			name: 'עוגת אנגלית חלבית',
			category: 'mixed-cakes',
			price: 60,
			image: '🍰',
			description: 'עוגת אנגלית חלבית עם קליפות הדרים',
		},
		{
			id: 23,
			name: 'עוגת מייפל אגוזים',
			category: 'mixed-cakes',
			price: 45,
			image: '🍰',
			description: 'עוגת מייפל אגוזים',
		},
		{
			id: 24,
			name: 'עוגת מייפל אגוזים טהור',
			category: 'mixed-cakes',
			price: 50,
			image: '🍰',
			description: 'עוגת מייפל אגוזים עם מייפל טהור',
		},
 
		// עוגיות
		{
			id: 25,
			name: "עוגיות שוקולד צ'יפס",
			category: 'cookies',
			price: 45,
			image: '🍪',
			description: "עוגיות עם שוקולד צ'יפס",
			popular: true,
		},
		
		{
			id: 26,
			name: "עוגיות שוקולד צ'יפס עשיר",
			category: 'cookies',
			price: 55,
			image: '🍪',
			description: "עוגיות עם שוקולד צ'יפס עשיר",
			popular: true,
		},
		{
			id: 27,
			name: "עוגיות שוקולד צ'יפס לבן",
			category: 'cookies',
			price: 45,
			image: '🍪',
			description: "עוגיות עם שוקולד צ'יפס לבן",
			popular: true,
		},
		{
			id: 28,
			name: "עוגיות שוקולד צ'יפס תות",
			category: 'cookies',
			price: 55,
			image: '🍪',
			description: "עוגיות עם שוקולד צ'יפס תות",
			popular: true,
		},
		{
			id: 29,
			name: "עוגיות שוקולד צ'יפס חום לבן",
			category: 'cookies',
			price: 45,
			image: '🍪',
			description: "עוגיות עם שוקולד צ'יפס חום לבן",
			popular: true,
		},
		{ id: 30, name: 'עוגיות חמאה', category: 'cookies', price: 40, image: '🍪', description: 'עוגיות חמאה פריכות קלאסיות' },
		{ id: 31, name: 'סהרוני שקדים', category: 'cookies', price: 50, image: '🥜', description: 'סהרוני שקדים פריכות' },
		{
			id: 32,
			name: 'עוגיות בריאות',
			category: 'cookies',
			price: 45,
			image: '🍪',
			description: 'עוגיות בריאות',
		},
		{
			id: 33,
			name: 'עוגיות פרח ריבה',
			category: 'cookies',
			price: 50,
			image: '🍪',
			description: 'עוגיות פרח ריבה',
			popular: true,
		},
		{ id: 34, name: 'מגולגלות תמרים ללא סוכר', category: 'cookies', price: 50, image: '🌈', description: 'מגולגלות תמרים ללא סוכר פריך מאוד' },
		{ id: 35, name: 'קוקילידה', category: 'cookies', price: 12, image: '🍪', description: 'קוקילידה' },
		{ id: 36, name: 'חיתוכיות תות תפוח', category: 'cookies', price: 50, image: '🍪', description: 'חיתוכיות תות תפוח' },
		{ id: 37, name: 'עוגיות לוקום', category: 'cookies', price: 50, image: '🍪', description: 'עוגיות רחת לוקום' },
		{ id: 38, name: 'עוגיות קוקוס ושוקולד', category: 'cookies', price: 50, image: '🍪', description: 'עוגיות קוקוס ושוקולד' },
		{ id: 39, name: 'עוגיות מרוקאיות', category: 'cookies', price: 50, image: '🍪', description: 'עוגיות מרוקאיות' },
		{ id: 40, name: 'שומשומיות', category: 'cookies', price: 50, image: '🍪', description: 'שומשומיות' },
		{ id: 41, name: 'ריפאת', category: 'cookies', price: 50, image: '🍪', description: 'ריפאת' },
		{ id: 42, name: 'אצבעות פילו חלבה', category: 'cookies', price: 50, image: '🍪', description: 'אצבעות פילו חלבה בזיגוג מייפל או סילאן' },
		{ id: 43, name: 'עוגיות לימון', category: 'cookies', price: 50, image: '🍪', description: 'עוגיות לימון' },
		{ id: 44, name: 'עוגיות קפה', category: 'cookies', price: 50, image: '🍪', description: 'עוגיות קפה' },
		{ id: 45, name: 'עוגיות פרג', category: 'cookies', price: 50, image: '🍪', description: 'עוגיות פרג' },
		{ id: 46, name: 'מגולגלות חלבה', category: 'cookies', price: 50, image: '🍪', description: 'מגולגלות חלבה' },
		{ id: 47, name: 'עוגיות אגוזים קינמון', category: 'cookies', price: 50, image: '🍪', description: 'עוגיות אגוזים קינמון' },
		
		// לחמים
		{
			id: 55,
			name: 'מארז לחמניות הבית לבן',
			category: 'breads',
			price: 25,
			image: '🍞',
			description: 'לחמניות קמח לבן (5 יח)',
			popular: true,
		},
		{ id: 56, name: 'חלה', category: 'breads', price: 20, image: '🍞', description: 'חלה לשבת' },
		{ id: 57, name: 'מארז לחמניות הבית כוסמין 80%', category: 'breads', price: 35, image: '🍞', description: 'לחמניות כוסמין 80% (5 יח)' },
		{ id: 58, name: "חלת כוסמין 80%", category: 'breads', price: 35, image: '🫓', description: "חלת כוסמין 80%" },
		{ id: 59, name: 'לחמניות שום כוסמין 80%', category: 'breads', price: 9, image: '🥖', description: "לחמניות שום כוסמין 80% (6 יח')" },
		{ id: 60, name: 'פיתות זעתר ושומשום', category: 'breads', price: 12, image: '🥖', description: "פיתות זעתר ושומשום" },
		{ id: 61, name: 'לחמניות שום', category: 'breads', price: 7, image: '🥖', description: "לחמניות שום" },

		// ללא סוכר
		{
			id: 70,
			name: 'מגולגלות תמרים ללא סוכר',
			category: 'sugar-free',
			price: 90,
			image: '🍇',
			description: 'מגולגלות תמרים ללא סוכר',
			popular: true,
		},
		{
			id: 71,
			name: 'עוגיות שיבולת שועל ללא סוכר',
			category: 'sugar-free',
			price: 50,
			image: '🌿',
			description: 'עוגיות בריאות עם דבש',
		},
		{
			id: 72,
			name: 'עוגת שמרים ללא סוכר',
			category: 'sugar-free',
			price: 55,
			image: '🍇',
			description: 'עוגת שמרים ללא סוכר',
		},
		{
			id: 73,
			name: 'עוגת גבינה ללא סוכר',
			category: 'sugar-free',
			price: 100,
			image: '🌾',
			description: 'עוגת גבינה ללא סוכר',
		},

		// ללא גלוטן
		{
			id: 80,
			name: 'עוגת שוקולד ללא גלוטן',
			category: 'gluten-free',
			price: 100,
			image: '�',
			description: 'עוגת שוקולד עשירה מקמח שקדים',
			popular: true,
		},
		{
			id: 81,
			name: 'עוגיות קוקוס ללא גלוטן',
			category: 'gluten-free',
			price: 55,
			image: '🥥',
			description: 'עוגיות קוקוס ללא גלוטן',
		},
		{
			id: 82,
			name: 'עוגת גבינה ללא גלוטן',
			category: 'gluten-free',
			price: 110,
			image: '🌾',
			description: 'עוגת גבינה ללא גלוטן',
		},

		// טבעוני
		{
			id: 88,
			name: 'עוגת שוקולד טבעונית',
			category: 'vegan',
			price: 95,
			image: '🌱',
			description: 'עוגת שוקולד ללא ביצים וחלב',
			popular: true,
		},
		{
			id: 89,
			name: 'עוגיות טבעוניות',
			category: 'vegan',
			price: 50,
			image: '🌱',
			description: "עוגיות שוקולד צ'יפס טבעוניות",
		},
		{ id: 90, name: 'מאפינס טבעוניים', category: 'vegan', price: 55, image: '🌱', description: 'מאפינס אוכמניות טבעוניים' },
		{ id: 91, name: 'לחם טבעוני', category: 'vegan', price: 35, image: '🌱', description: 'לחם ביתי ללא מוצרי חלב' },

		// גלידות
		{
			id: 95,
			name: 'גלידת וניל',
			category: 'ice-cream',
			price: 130,
			image: '🍦',
			description: 'גלידת וניל קלאסית ביתית קילו',
			popular: true,
		},
		{
			id: 96,
			name: 'גלידת שוקולד בלגי',
			category: 'ice-cream',
			price: 130,
			image: '🍫',
			description: 'גלידת שוקולד בלגי עשיר',
		},
		{
			id: 97,
			name: 'גלידת תות שמנת',
			category: 'ice-cream',
			price: 130,
			image: '🍓',
			description: 'גלידת תות עם פירות טריים קילו',
		},
		{ id: 98, name: 'גלידת פיסטוק', category: 'ice-cream', price: 130, image: '🟢', description: 'גלידת פיסטוק איטלקית קילו' },
		{ id: 99, name: 'גלידת מנגו', category: 'ice-cream', price: 130, image: '🥭', description: 'גלידת מנגו טרופית קילו' },
		{ id: 100, name: 'סורבה לימון', category: 'ice-cream', price: 130, image: '🍋', description: 'סורבה לימון מרעננת קילו' },

		// ארוחות חלביות - פיצות
		{
			id: 106,
			name: 'פיצה מהחלומות',
			category: 'dairy-meals',
			subcategory: 'pizzas',
			price: 70,
			image: '🍕',
			description: 'פיצה עם רוטב עגבניות ומוצרלה ו2 תוספות',
			popular: true,
		},

		// ארוחות חלביות - קישים
		{
			id: 110,
			name: 'קיש בטטה גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '🥧',
			description: 'קיש בטטה גדול עם 3 תוספות',
			popular: true,
		},
		{
			id: 111,
			name: 'קיש בטטה קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '🥧',
			description: 'קיש בטטה קטן',
		},
		{
			id: 112,
			name: 'קיש ברוקולי גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '🥧',
			description: 'קיש ברוקולי גדול',
		},
		{
			id: 113,
			name: 'קיש ברוקולי קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '🥧',
			description: 'קיש ברוקולי קטן',
		},
		{
			id: 114,
			name: 'קיש תרד גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '🥧',
			description: 'קיש תרד גדול עם 3 תוספות',
			popular: true,
		},
		{
			id: 115,
			name: 'קיש תרד קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '🥧',
			description: 'קיש תרד קטן',
		},
		{
			id: 116,
			name: 'קיש פטריות גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '🥧',
			description: 'קיש פטריות גדול',
		},
		{
			id: 117,
			name: 'קיש פטריות קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '🥧',
			description: 'קיש פטריות קטן',
		},
		{
			id: 118,
			name: 'קיש מנגולד גדול',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 180,
			image: '🥧',
			description: 'קיש מנגולד גדול',
		},
		{
			id: 119,
			name: 'קיש מנגולד קטן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 120,
			image: '🥧',
			description: 'קיש מנגולד קטן',
		},
		// ארוחות חלביות - בורקס		
		{
			id: 120,
			name: 'בורקס תפוח אדמה',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 10,
			image: '🥧',
			description: 'בורקס תפוח אדמה',
		},
		{
			id: 121,
			name: 'בורקס גבינה',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 10,
			image: '🥧',
			description: 'בורקס גבינה',
		},
		{
			id: 122,
			name: 'שבלול פילו גדול',
			category: 'dairy-meals',
			subcategory: 'borax',
			price: 170,
			image: '🥧',
			description: 'שבלול פילו גדול',
		},

		// ארוחות חלביות - פסטות
		{
			id: 140,
			name: 'פסטה אלפרדו',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 120,
			image: '🍝',
			description: 'פסטה ברוטב שמנת ופרמזן',
			popular: true,
		},
		{
			id: 141,
			name: 'פסטה עגבניות',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 120,
			image: '🍝',
			description: 'פסטה ברוטב עגבניות ביתי',
		},
		{
			id: 142,
			name: 'פסטה פסטו',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 120,
			image: '🍝',
			description: 'פסטה ברוטב פסטו טרי',
		},

		// מגשי אירועים
		{
			id: 155,
			name: 'קוקוס פירות מעוצבים',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '🥥',
			description: 'קוקוס פירות מעוצבים כ30 יחידות',
		},
		{
			id: 156,
			name: 'פקעות בוטנים',
			category: 'events',
			subcategory: 'events',
			price: 280,
			image: '🥥',
			description: 'פקעות בוטנים כ40 יחידות',
		},
		{
			id: 157,
			name: 'מקרוד',
			category: 'events',
			subcategory: 'events',
			price: 240,
			image: '🥥',
			description: 'מקרוד עוגיות מבצק סולת ממולא תמרים מטוגנות וטבולות בדבש כ30 יחידות',
		},
		{
			id: 158,
			name: 'אצבעות פילו שקדים בדבש',
			category: 'events',
			subcategory: 'events',
			price: 200,
			image: '🥥',
			description: 'אצבעות פילו שקדים בדבש כ20 יחידות',
		},
		{
			id: 159,
			name: 'סיגר מטוגן במילוי שקדים',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '🥥',
			description: 'סיגר מטוגן במילוי שקדים כ30 יחידות',
		},
		{
			id: 160,
			name: 'סיגר מטוגן במילוי פיסטוקים',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '🥥',
			description: 'סיגר מטוגן במילוי פיסטוקים כ30 יחידות',
		},
		{
			id: 161,
			name: 'סיגר מטוגן במילוי אגוזים',
			category: 'events',
			subcategory: 'events',
			price: 210,
			image: '🥥',
			description: 'סיגר מטוגן במילוי אגוזים כ30 יחידות',
		},
		{
			id: 162,
			name: 'ספינג',
			category: 'events',
			subcategory: 'events',
			price: 180,
			image: '🍤',
			description: 'מגש ספינג כ32 יחידות',
		},
	]);

	// ===== GETTERS =====

	// Get products by category
	const getProductsByCategory = computed(() => {
		return categoryId => products.value.filter(p => p.category === categoryId);
	});

	// Get products by subcategory (for dairy meals)
	const getProductsBySubcategory = computed(() => {
		return subcategoryId => products.value.filter(p => p.subcategory === subcategoryId);
	});

	// Get popular products from a category (limit)
	const getPopularByCategory = computed(() => {
		return (categoryId, limit = 4) => {
			const categoryProducts = products.value.filter(p => p.category === categoryId);
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
				if (product.category === 'baking-workshops') return false;

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
		// State
		categories,
		products,
		dairySubcategories,
		// Getters (computed)
		getProductsByCategory,
		getProductsBySubcategory,
		getPopularByCategory,
		popularProducts,
		getCategoryPreview,
		// Functions
		searchProducts,
		getCategoryById,
		getProductById,
	};
});
