import { useEffect, useState } from 'react';
import { search_users } from '../shared/services/api/user.api';
import { UserSearchResult } from '../types/user.types';

const minimum_search_query_length = 2;
const search_debounce_ms = 350;

export function useUserSearch(search_query: string) {
  const [is_loading_user_search, set_is_loading_user_search] = useState(false);
  const [user_search_error, set_user_search_error] = useState('');
  const [user_search_results, set_user_search_results] = useState<
    UserSearchResult[]
  >([]);
  const trimmed_search_query = search_query.trim();
  const has_search_query = trimmed_search_query.length >= minimum_search_query_length;

  useEffect(() => {
    let is_active = true;

    if (!has_search_query) {
      set_is_loading_user_search(false);
      set_user_search_error('');
      set_user_search_results([]);

      return;
    }

    const search_timeout = setTimeout(() => {
      void (async () => {
        try {
          set_is_loading_user_search(true);
          set_user_search_error('');
          const results = await search_users(trimmed_search_query);

          if (!is_active) {
            return;
          }

          set_user_search_results(results);
        } catch (error) {
          if (!is_active) {
            return;
          }

          const message =
            error instanceof Error
              ? error.message
              : 'Failed to search for people.';

          set_user_search_error(message);
          set_user_search_results([]);
        } finally {
          if (is_active) {
            set_is_loading_user_search(false);
          }
        }
      })();
    }, search_debounce_ms);

    return () => {
      is_active = false;
      clearTimeout(search_timeout);
    };
  }, [has_search_query, trimmed_search_query]);

  return {
    has_search_query,
    is_loading_user_search,
    user_search_error,
    user_search_results,
  };
}
