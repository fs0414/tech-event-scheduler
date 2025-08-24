export const UI_CONSTANTS = {
  // カラーパレット
  colors: {
    // プライマリカラー（ブランド要素用）
    primary: 'bg-[#00c4cc] hover:bg-[#00a8b0] text-[#23221f]', // 白文字は非推奨
    // セカンダリカラー（テキスト用）
    secondary: 'bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#23221f]',
    // アクセントカラー（ハイライト用）
    accent: 'bg-[#ff9900] hover:bg-[#e6800d] text-white',
    // セマンティックカラー
    success: 'bg-[#16a34a] hover:bg-[#15803d] text-white', // Grass系
    warning: 'bg-[#eab308] hover:bg-[#ca8a04] text-[#23221f]', // Sunlight系  
    danger: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white', // Momiji系
    
    // 背景色（白背景ベース）
    pageBg: 'bg-white',
    cardBg: 'bg-white',
    mutedBg: 'bg-[#f9fafb]', // より明るいグレー
    accentBg: 'bg-[#ecfeff]',
    
    // 淡い色パターン（水色が映えるように）
    lightBg: 'bg-[#fefefe]', // 純白よりわずかに温かい白
    softBg: 'bg-[#f8fafc]', // 非常に淡いブルーグレー
    paleAccentBg: 'bg-[#f0fdff]', // 極淡い水色背景
    warmBg: 'bg-[#fffef7]', // わずかに温かみのある白
    
    // 追加の淡い背景パターン
    creamBg: 'bg-[#fdfdfb]', // クリーム色
    mistBg: 'bg-[#f6f8fa]', // ミスト色
    pearlBg: 'bg-[#fcfcfc]', // パール色
    glacierBg: 'bg-[#f0f9ff]', // 氷河色（淡い青）
    
    // テキスト色（白背景でもはっきり見えるように改善）
    primaryText: 'text-[#00c4cc]',
    mutedText: 'text-[#374151]', // より濃いグレーに変更（#374151は確実に見える）
    bodyText: 'text-[#111827]', // より濃い黒に変更
    secondaryText: 'text-[#4b5563]', // より濃いグレーに変更
    
    // くろめの色（淡い背景で見やすい濃い色）
    darkText: 'text-[#0f172a]', // 非常に濃い黒
    richText: 'text-[#1e293b]', // リッチブラック
    deepText: 'text-[#334155]', // 深いグレー
    boldText: 'text-[#0c0a09]', // 極濃い黒
    
    // ボーダー
    border: 'border border-[#e7e5e4]',
    accentBorder: 'border border-[#67e8f9]'
  },
  
  // スペーシングシステム（4pxベースグリッド）
  spacing: {
    // プリミティブトークン（remベース、16px基準）
    none: '0',           // 0px
    x3s: '0.25rem',      // 4px  - X3S
    xxs: '0.5rem',       // 8px  - XXS
    xs: '1rem',          // 16px - XS
    s: '1.5rem',         // 24px - S
    m: '2rem',           // 32px - M
    l: '2.5rem',         // 40px - L
    xl: '3rem',          // 48px - XL
    xxl: '4rem',         // 64px - XXL
    
    // セマンティックトークン（用途別）
    cardPadding: 'p-6',        // L相当
    sectionPadding: 'p-4',     // M相当
    smallPadding: 'p-3',       // S相当
    marginBottom: 'mb-6',      // L相当
    gap: 'gap-4',              // M相当
    smallGap: 'gap-2',         // XXS相当
    largeGap: 'gap-8'          // XL相当
  },
  
  // タイポグラフィシステム
  typography: {
    // フォントファミリー（システムフォント）
    fontFamily: 'font-sans', // system-ui, -apple-system準拠
    
    // フォントサイズスケール（16px基準）
    xxs: 'text-[0.667rem] leading-[1]',      // 10.67px - ラベル用（NONE行間）
    xs: 'text-[0.75rem] leading-[1]',        // 12px - ラベル用（NONE行間）
    s: 'text-[0.857rem] leading-[1.5]',      // 13.71px - 段落用（NORMAL行間）
    m: 'text-base leading-[1.5]',            // 16px - 段落用（NORMAL行間）
    l: 'text-[1.2rem] leading-[1.25]',       // 19.2px - 見出し用（TIGHT行間）
    xl: 'text-[1.5rem] leading-[1.25]',      // 24px - 見出し用（TIGHT行間）
    xxl: 'text-[2rem] leading-[1.25]',       // 32px - 見出し用（TIGHT行間）
    
    // フォントウェイト
    regular: 'font-normal',
    medium: 'font-medium', 
    semibold: 'font-semibold',
    bold: 'font-bold'
  },
  
  // ボーダーラディウス
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',        // 2px
    md: 'rounded-md',        // 6px 
    lg: 'rounded-lg',        // 8px
    card: 'rounded-lg',      // カード用
    button: 'rounded-md',    // ボタン用
    input: 'rounded-md',     // インプット用
    avatar: 'rounded-full'   // アバター用
  },
  
  // ボタンサイズ
  buttons: {
    large: 'px-[2.5rem] py-[1rem] text-base font-medium',    // L padding + M typography
    medium: 'px-[2rem] py-[0.5rem] text-sm font-medium',     // M padding + S typography  
    small: 'px-[1.5rem] py-[0.25rem] text-xs font-medium',   // S padding + XS typography
    icon: 'p-[0.5rem]'                                       // XXS padding
  },
  
  // アバターサイズ（4pxグリッド準拠）
  avatars: {
    small: 'h-8 w-8',      // 32px - M相当
    medium: 'h-10 w-10',   // 40px - L相当
    large: 'h-12 w-12'     // 48px - XL相当
  },
  
  // 状態表示
  states: {
    loading: 'opacity-50 cursor-not-allowed',
    disabled: 'opacity-60 cursor-not-allowed pointer-events-none',
    pending: 'animate-pulse',
    focus: 'focus:outline-none focus:ring-2 focus:ring-[#00c4cc] focus:ring-offset-2',
    hover: 'hover:shadow-sm transition-all duration-200'
  },
  
  // アニメーション
  transitions: {
    default: 'transition-colors duration-200 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out', 
    slow: 'transition-all duration-300 ease-in-out',
    bounce: 'transition-transform duration-200 ease-out hover:scale-105'
  }
} as const;

// ユーティリティ関数
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// コンポーネント用のクラス生成関数
export const createButtonClasses = (
  variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' = 'primary', 
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  return cn(
    UI_CONSTANTS.colors[variant],
    UI_CONSTANTS.buttons[size],
    UI_CONSTANTS.radius.button,
    UI_CONSTANTS.transitions.default,
    UI_CONSTANTS.states.focus,
    'inline-flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed'
  );
};

export const createCardClasses = (variant: 'default' | 'accent' | 'muted' | 'light' | 'soft' | 'paleAccent' | 'warm' | 'cream' | 'mist' | 'pearl' | 'glacier' = 'default') => {
  const baseClasses = cn(
    UI_CONSTANTS.radius.card,
    UI_CONSTANTS.transitions.default,
    'shadow-sm'
  );
  
  const borderClasses = {
    default: UI_CONSTANTS.colors.border,
    accent: UI_CONSTANTS.colors.accentBorder,
    muted: UI_CONSTANTS.colors.border,
    light: 'border border-[#f1f5f9]', // 淡いボーダー
    soft: 'border border-[#e2e8f0]', // ソフトなボーダー
    paleAccent: 'border border-[#cffafe]', // 淡い水色ボーダー
    warm: 'border border-[#fef3c7]', // 温かみのあるボーダー
    cream: 'border border-[#fef7e3]', // クリームボーダー
    mist: 'border border-[#e4e7eb]', // ミストボーダー
    pearl: 'border border-[#f3f4f6]', // パールボーダー
    glacier: 'border border-[#dbeafe]' // 氷河ボーダー
  };
  
  const backgroundClasses = {
    default: UI_CONSTANTS.colors.cardBg,
    accent: UI_CONSTANTS.colors.accentBg,
    muted: UI_CONSTANTS.colors.mutedBg,
    light: UI_CONSTANTS.colors.lightBg,
    soft: UI_CONSTANTS.colors.softBg,
    paleAccent: UI_CONSTANTS.colors.paleAccentBg,
    warm: UI_CONSTANTS.colors.warmBg,
    cream: UI_CONSTANTS.colors.creamBg,
    mist: UI_CONSTANTS.colors.mistBg,
    pearl: UI_CONSTANTS.colors.pearlBg,
    glacier: UI_CONSTANTS.colors.glacierBg
  };
  
  return cn(
    baseClasses,
    borderClasses[variant],
    backgroundClasses[variant]
  );
};

export const createAvatarClasses = (
  size: 'small' | 'medium' | 'large' = 'medium', 
  color: 'muted' | 'primary' | 'accent' | 'success' = 'muted'
) => {
  const sizeClass = UI_CONSTANTS.avatars[size];
  
  const colorClasses = {
    muted: UI_CONSTANTS.colors.mutedBg + ' text-[#374151]',
    primary: 'bg-[#ecfeff] text-[#00c4cc]',
    accent: 'bg-[#fff7ed] text-[#ff9900]',
    success: 'bg-[#f0fdf4] text-[#16a34a]',
  };
  
  return cn(
    sizeClass,
    colorClasses[color],
    UI_CONSTANTS.radius.avatar,
    'flex items-center justify-center font-medium'
  );
};

/**
 * build typography classes
 * @param size 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl', default 'm'。
 * @param weight 'regular' | 'medium' | '
 * semibold' | 'bold' default 'regular'
 * @param color 'body' | 'primary' | 'muted' | 'secondary', default 'body'。
 *  
 * @returns builded typography classes string
 * @example
 * const headingClasses = createTypographyClasses('xl', 'bold', 'primary');
 * const paragraphClasses = createTypographyClasses('m', 'regular', 'body');
 */
export const createTypographyClasses = (
  size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' = 'm',
  weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular',
  color: 'body' | 'primary' | 'muted' | 'secondary' | 'dark' | 'rich' | 'deep' | 'bold' = 'body'
) => {
  const colorClasses = {
    body: UI_CONSTANTS.colors.bodyText,
    primary: UI_CONSTANTS.colors.primaryText,
    muted: UI_CONSTANTS.colors.mutedText,
    secondary: UI_CONSTANTS.colors.secondaryText,
    dark: UI_CONSTANTS.colors.darkText,
    rich: UI_CONSTANTS.colors.richText,
    deep: UI_CONSTANTS.colors.deepText,
    bold: UI_CONSTANTS.colors.boldText,
  };
  
  return cn(
    UI_CONSTANTS.typography.fontFamily,
    UI_CONSTANTS.typography[size],
    UI_CONSTANTS.typography[weight],
    colorClasses[color]
  );
};

// スペーシングクラス生成
export const createSpacingClasses = (
  type: 'padding' | 'margin' | 'gap',
  size: 'none' | 'x3s' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl',
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'x' | 'y'
) => {
  const prefix = type === 'padding' ? 'p' : type === 'margin' ? 'm' : 'gap';
  const directionSuffix = direction ? (direction === 'x' || direction === 'y' ? direction : direction.charAt(0)) : '';
  const sizeValue = UI_CONSTANTS.spacing[size];
  
  if (type === 'gap') {
    return `gap-[${sizeValue}]`;
  }
  
  return `${prefix}${directionSuffix}-[${sizeValue}]`;
};
