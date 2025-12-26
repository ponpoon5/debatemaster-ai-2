import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { List, ListImperativeAPI, useListCallbackRef } from 'react-window';
import { Message, DebateSettings, ArgumentAnalysis, DemoTurn, UtteranceStructureScore } from '../../core/types';
import { MessageItem } from './MessageItem';

interface VirtualizedMessageListProps {
  messages: Message[];
  settings: DebateSettings;
  analyses: Record<string, ArgumentAnalysis>;
  demoParsedMessages: Record<string, DemoTurn>;
  detectedFallacy?: string;
  highlightQuote?: string;
  onHighlightClick: () => void;
  containerHeight: number;
}

export interface VirtualizedMessageListHandle {
  scrollToBottom: () => void;
}

/**
 * 仮想スクロールを使用したメッセージリストコンポーネント
 *
 * react-windowのVariableSizeListを使用して、大量のメッセージ（100+）を効率的にレンダリング
 * Phase 2: 可変高さ対応で、各メッセージの実際の高さに基づいて動的にレンダリング
 */
export const VirtualizedMessageList = forwardRef<VirtualizedMessageListHandle, VirtualizedMessageListProps>(
  (
    {
      messages,
      settings,
      analyses,
      demoParsedMessages,
      detectedFallacy,
      highlightQuote,
      onHighlightClick,
      containerHeight,
    },
    ref
  ) => {
    const [listRef, setListRef] = useListCallbackRef();

    // 可変高さ管理: 各行の高さをキャッシュ
    const rowHeightsRef = useRef<Map<number, number>>(new Map());

    // デフォルト高さ（未測定時の推定値）
    const DEFAULT_ROW_HEIGHT = 180;

    // 各行の高さを取得（キャッシュ活用）
    const getItemSize = (index: number): number => {
      return rowHeightsRef.current.get(index) || DEFAULT_ROW_HEIGHT;
    };

    // 各行の高さを設定し、リストを更新
    const setItemSize = (index: number, size: number) => {
      const currentSize = rowHeightsRef.current.get(index);
      if (currentSize !== size) {
        rowHeightsRef.current.set(index, size);
        // 高さが変わった場合、その位置以降を再計算
        if (listRef) {
          listRef.resetAfterIndex?.(index);
        }
      }
    };

    // 最下部へのスクロール
    const scrollToBottom = () => {
      if (listRef && messages.length > 0) {
        listRef.scrollToRow(messages.length - 1, 'end');
      }
    };

    // 外部から呼び出せるメソッドを公開
    useImperativeHandle(ref, () => ({
      scrollToBottom,
    }));

    // 新しいメッセージが追加されたら自動スクロール
    useEffect(() => {
      scrollToBottom();
    }, [messages.length, listRef]);

    // メッセージ数変更時に高さキャッシュをクリーンアップ
    useEffect(() => {
      const currentCount = messages.length;
      const cachedIndices = Array.from(rowHeightsRef.current.keys());

      // メッセージ数より大きいインデックスのキャッシュを削除
      cachedIndices.forEach(idx => {
        if (idx >= currentCount) {
          rowHeightsRef.current.delete(idx);
        }
      });
    }, [messages.length]);

    // 各行のコンポーネント（高さ測定付き）
    const RowComponent = ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const msg = messages[index];
      const rowRef = useRef<HTMLDivElement>(null);

      // 実際のDOM要素の高さを測定して記録
      useEffect(() => {
        if (rowRef.current) {
          const measuredHeight = rowRef.current.getBoundingClientRect().height;
          if (measuredHeight > 0) {
            setItemSize(index, measuredHeight);
          }
        }
      }, [index, msg.text, analyses[msg.id], demoParsedMessages[msg.id]]);

      return (
        <div ref={rowRef} style={style}>
          <MessageItem
            msg={msg}
            index={index}
            settings={settings}
            analysis={analyses[msg.id]}
            demoParsedData={demoParsedMessages[msg.id]}
            structureScore={msg.structureAnalysis}
            supportMode={true}
            detectedFallacy={detectedFallacy}
            highlightQuote={highlightQuote}
            onHighlightClick={onHighlightClick}
          />
        </div>
      );
    };

    return (
      <List
        listRef={setListRef}
        defaultHeight={containerHeight}
        rowCount={messages.length}
        rowHeight={getItemSize}
        rowComponent={RowComponent}
        overscanCount={5}
      />
    );
  }
);

VirtualizedMessageList.displayName = 'VirtualizedMessageList';
