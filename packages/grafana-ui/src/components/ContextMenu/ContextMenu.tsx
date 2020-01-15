import React, { useContext, useRef, useState, useLayoutEffect } from 'react';
import { css, cx } from 'emotion';
import useClickAway from 'react-use/lib/useClickAway';
import { selectThemeVariant, ThemeContext } from '../../index';
import { GrafanaTheme } from '@grafana/data';
import { stylesFactory } from '../../themes/stylesFactory';
import { Portal, List } from '../index';
import { LinkTarget } from '@grafana/data';
import ImageGallery from 'react-image-gallery';
import { FlotDataPoint } from '../../../../../public/app/plugins/panel/graph/GraphContextMenuCtrl';
import { listBuckets } from '../../utils/minio';

export interface ContextMenuItem {
  label: string;
  target?: LinkTarget;
  icon?: string;
  url?: string;
  onClick?: (event?: React.SyntheticEvent<HTMLElement>) => void;
  group?: string;
}

export interface ContextMenuGroup {
  label?: string;
  items: ContextMenuItem[];
  source?: FlotDataPoint | null;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items?: ContextMenuGroup[];
  renderHeader?: () => JSX.Element;
  source?: FlotDataPoint | null;
}

const getContextMenuStyles = stylesFactory((theme: GrafanaTheme) => {
  const linkColor = selectThemeVariant(
    {
      light: theme.colors.dark2,
      dark: theme.colors.text,
    },
    theme.type
  );
  const linkColorHover = selectThemeVariant(
    {
      light: theme.colors.link,
      dark: theme.colors.white,
    },
    theme.type
  );
  const wrapperBg = selectThemeVariant(
    {
      light: theme.colors.gray7,
      dark: theme.colors.dark2,
    },
    theme.type
  );
  const wrapperShadow = selectThemeVariant(
    {
      light: theme.colors.gray3,
      dark: theme.colors.black,
    },
    theme.type
  );
  const itemColor = selectThemeVariant(
    {
      light: theme.colors.black,
      dark: theme.colors.white,
    },
    theme.type
  );

  const groupLabelColor = selectThemeVariant(
    {
      light: theme.colors.gray1,
      dark: theme.colors.textWeak,
    },
    theme.type
  );

  const itemBgHover = selectThemeVariant(
    {
      light: theme.colors.gray5,
      dark: theme.colors.dark7,
    },
    theme.type
  );
  const headerBg = selectThemeVariant(
    {
      light: theme.colors.white,
      dark: theme.colors.dark1,
    },
    theme.type
  );
  const headerSeparator = selectThemeVariant(
    {
      light: theme.colors.white,
      dark: theme.colors.dark7,
    },
    theme.type
  );

  return {
    header: css`
      padding: 4px;
      border-bottom: 1px solid ${headerSeparator};
      background: ${headerBg};
      margin-bottom: ${theme.spacing.xs};
      border-radius: ${theme.border.radius.sm} ${theme.border.radius.sm} 0 0;
    `,
    wrapper: css`
      background: ${wrapperBg};
      z-index: 1;
      box-shadow: 0 2px 5px 0 ${wrapperShadow};
      min-width: 200px;
      display: inline-block;
      border-radius: ${theme.border.radius.sm};
    `,
    link: css`
      color: ${linkColor};
      display: flex;
      cursor: pointer;
      &:hover {
        color: ${linkColorHover};
        text-decoration: none;
      }
    `,
    item: css`
      background: none;
      padding: 4px 8px;
      color: ${itemColor};
      border-left: 2px solid transparent;
      cursor: pointer;
      &:hover {
        background: ${itemBgHover};
        border-image: linear-gradient(#f05a28 30%, #fbca0a 99%);
        border-image-slice: 1;
      }
    `,
    groupLabel: css`
      color: ${groupLabelColor};
      font-size: ${theme.typography.size.sm};
      line-height: ${theme.typography.lineHeight.md};
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
    `,
    icon: css`
      opacity: 0.7;
      width: 12px;
      height: 12px;
      display: inline-block;
      margin-right: 10px;
      color: ${theme.colors.linkDisabled};
      position: relative;
      top: 4px;
    `,
  };
});

export const ContextMenu: React.FC<ContextMenuProps> = React.memo(({ x, y, onClose, items, renderHeader, source }) => {
  const theme = useContext(ThemeContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const [positionStyles, setPositionStyles] = useState({});

  useLayoutEffect(() => {
    const menuElement = menuRef.current;
    if (menuElement) {
      const rect = menuElement.getBoundingClientRect();
      const OFFSET = 5;
      const collisions = {
        right: window.innerWidth < x + rect.width,
        bottom: window.innerHeight < rect.bottom + rect.height + OFFSET,
      };

      setPositionStyles({
        position: 'fixed',
        left: collisions.right ? x - rect.width - OFFSET : x - OFFSET,
        // top: collisions.bottom ? y - rect.height - OFFSET : y + OFFSET,
        top: y + OFFSET, // thanhnd with thumbnail, we always set it to downward
      });
    }
  }, [menuRef.current]);

  useClickAway(menuRef, () => {
    if (onClose) {
      onClose();
    }
  });

  const styles = getContextMenuStyles(theme);
  return (
    <Portal>
      <div ref={menuRef} style={positionStyles} className={styles.wrapper}>
        {renderHeader && <div className={styles.header}>{renderHeader()}</div>}
        <List
          items={items || []}
          renderItem={(item, index) => {
            return (
              <>
                <ContextMenuGroup source={source} group={item} onClick={onClose} />
              </>
            );
          }}
        />
      </div>
    </Portal>
  );
});

interface ContextMenuItemProps {
  label: string;
  icon?: string;
  url?: string;
  target?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = React.memo(
  ({ url, icon, label, target, onClick, className }) => {
    const theme = useContext(ThemeContext);
    const styles = getContextMenuStyles(theme);
    return (
      <div className={styles.item}>
        <a
          href={url ? url : undefined}
          target={target || '_self'}
          className={cx(className, styles.link)}
          onClick={e => {
            if (onClick) {
              onClick(e);
            }
          }}
        >
          {icon && <i className={cx(`${icon}`, styles.icon)} />} {label}
        </a>
      </div>
    );
  }
);

interface ContextMenuGroupProps {
  group: ContextMenuGroup;
  onClick?: () => void; // Used with 'onClose',
  source?: FlotDataPoint | null;
}

const imagePrefixUrl = 'https://htaviet.s3-ap-southeast-1.amazonaws.com/bmt/passion-fruit/';

const ContextMenuGroup: React.FC<ContextMenuGroupProps> = ({ group, onClick, source }) => {
  const theme = useContext(ThemeContext);
  const styles = getContextMenuStyles(theme);

  if (group.items.length === 0) {
    return null;
  }

  let items: any = [];
  if (source) {
    const d = new Date(0);
    d.setUTCMilliseconds(source.datapoint[0]);
    const date = d.toISOString().split('T')[0];
    const urlPrefix = imagePrefixUrl + date + '/';

    // todo call to s3 to get media
    listBuckets();

    const pics = ['shutterstock_1096552103-1.jpg', 'electronicdesign_17456_iotfarming_promonew_0.png'];

    items = pics.map(pic => {
      return {
        original: urlPrefix + pic,
        thumbnail: urlPrefix + pic,
      };
    });
  }
  return (
    <div>
      {group.label && <div className={styles.groupLabel}>{group.label}</div>}
      <List
        items={group.items || []}
        renderItem={item => {
          return (
            <ContextMenuItem
              url={item.url}
              label={item.label}
              target={item.target}
              icon={item.icon}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                if (item.onClick) {
                  item.onClick(e);
                }

                // Typically closes the context menu
                if (onClick) {
                  onClick();
                }
              }}
            />
          );
        }}
      />
      {items && items.length > 0 && (
        <div>
          <ImageGallery items={items} />
        </div>
      )}
    </div>
  );
};
ContextMenu.displayName = 'ContextMenu';
