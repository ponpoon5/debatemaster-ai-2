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

    // 固定高さ（平均的なメッセージの高さ）
    const ROW_HEIGHT = 180;

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

    // 各行のコンポーネント
    const RowComponent = ({ index }: { index: number }) => {
      const msg = messages[index];

      return (
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
      );
    };

    return (
      <List
        listRef={setListRef}
        defaultHeight={containerHeight}
        rowCount={messages.length}
        rowHeight={ROW_HEIGHT}
        rowComponent={RowComponent}
        overscanCount={5}
      />
    );
  }
);

VirtualizedMessageList.displayName = 'VirtualizedMessageList';
