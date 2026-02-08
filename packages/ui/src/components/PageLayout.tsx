/**
 * ページレイアウトコンポーネント - 型安全な実装
 */

import { Box, Container } from "@yamada-ui/react";
import type { FC, ReactNode } from "react";

/**
 * コンテナの最大幅オプション
 */
export type ContainerMaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "full";

/**
 * PageLayoutコンポーネントのプロパティ
 */
export interface PageLayoutProps {
  /** ページコンテンツ */
  readonly children: ReactNode;
  /** コンテナの最大幅（デフォルト: "6xl"） */
  readonly maxW?: ContainerMaxWidth;
  /** 垂直方向のパディング（デフォルト: 8） */
  readonly py?: number;
  /** 中央寄せ（デフォルト: true） */
  readonly centerContent?: boolean;
}

/**
 * ページレイアウトコンポーネント
 *
 * アプリケーション全体で一貫したレイアウトを提供します。
 * ダークモード対応、レスポンシブ対応を含みます。
 *
 * @example
 * ```tsx
 * <PageLayout maxW="4xl" py={12}>
 *   <h1>ページタイトル</h1>
 *   <p>ページコンテンツ</p>
 * </PageLayout>
 * ```
 */
export const PageLayout: FC<PageLayoutProps> = ({
  children,
  maxW = "6xl",
  py = 8,
  centerContent = false,
}) => {
  return (
    <Box minH="100vh" bg="#f8fcfd" _dark={{ bg: "gray.900" }}>
      <Container
        maxW={maxW}
        py={{ base: 4, md: py }}
        px={{ base: 4, md: 6 }}
        {...(centerContent && {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        {children}
      </Container>
    </Box>
  );
};
