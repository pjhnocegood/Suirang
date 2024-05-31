import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../entity/game.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SuiWeb3Service {
  API_KEY = '';
  HEADERS = {};

  DATA_ENDPOINT =
    'https://api.zettablock.com/api/v1/databases/AwsDataCatalog/queries';

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private configService: ConfigService,
  ) {
    this.API_KEY = this.configService.get<string>('API_KEY');
    this.HEADERS = {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-API-KEY': this.API_KEY,
    };
  }

  async getRankingList(
    id: number,
    startDate: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const game = await this.gameRepository.findOne({ where: { id } });
    const result = await this.queryRankingList(game, startDate, page, pageSize);
    return this.parseRankingData(result).slice(1);
  }

  async getCoinAssetTracking(
    gameId: number,
    walletAddress: string,
    startDate: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    const result = await this.queryCoinAssetTracking(
      game,
      walletAddress,
      startDate,
      page,
      pageSize,
    );
    return this.parseCoinAssetTrackingData(result).slice(1);
  }

  async getNftAssetTracking(
    gameId: number,
    walletAddress: string,
    startDate: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    const result = await this.queryNftAssetTracking(
      game,
      walletAddress,
      startDate,
      page,
      pageSize,
    );
    return this.parseNftAssetTrackingData(result).slice(1);
  }

  async getGamesTransactionCount(
    gameId: number,
    startDate?: string,
    walletAddress?: string,
  ) {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    const result = await this.queryGameTransactionCount(
      game.packageId,
      startDate,
      walletAddress,
    );
    return this.parseGameTransactionCount(result);
  }

  async parseGameTransactionCount(data: string): Promise<number> {
    const lines = data.trim().split('\n');
    return Number(lines[1]);
  }

  async getEvent(
    gameId: number,
    walletAddress: string,
    startDate: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    const result = await this.queryEvent(
      game,
      walletAddress,
      startDate,
      page,
      pageSize,
    );
    return this.parseEvent(result).slice(1);
  }

  private async queryCoinAssetTracking(
    game: Game,
    walletAddress: string,
    startDate: string,
    page: number,
    pageSize: number,
  ) {
    const packageIds = game.packageId;

    const query = {
      query: this.createCoinAssetTrackingQuery(
        startDate,
        walletAddress,
        packageIds,
        page,
        pageSize,
      ),
      resultCacheExpireMillis: 86400000,
    };
    return await this.getQuery(query);
  }

  private async queryNftAssetTracking(
    game: Game,
    walletAddress: string,
    startDate: string,
    page: number,
    pageSize: number,
  ) {
    const packageIds = game.packageId;

    const query = {
      query: this.createNftAssetTrackingQuery(
        startDate,
        walletAddress,
        packageIds,
        page,
        pageSize,
      ),
      resultCacheExpireMillis: 86400000,
    };
    return await this.getQuery(query);
  }

  async queryGameTransactionCount(
    packageIds: string[],
    startDate: string,
    walletAddress?,
  ) {
    const query = {
      query: this.createGameTransactionCount(
        packageIds,
        startDate,
        walletAddress,
      ),
      resultCacheExpireMillis: 86400000,
    };
    return await this.getQuery(query);
  }

  async queryRankingList(
    game: Game,
    startDate: string,
    page: number,
    pageSize: number,
  ) {
    const packageIds = game.packageId;
    //const eventType = 'arcade_champion::HeroUpdated';
    const eventType = game.eventType;
    const query = {
      query: this.createRankingQuery(
        startDate,
        packageIds,
        eventType,
        page,
        pageSize,
      ),
      resultCacheExpireMillis: 86400000,
    };
    return await this.getQuery(query);
  }

  async queryEvent(
    game: Game,
    walletAddress: string,
    startDate: string,
    page: number,
    pageSize: number,
  ) {
    const packageIds = game.packageId;

    const query = {
      query: this.createEventQuery(
        startDate,
        walletAddress,
        packageIds,
        page,
        pageSize,
      ),
      resultCacheExpireMillis: 86400000,
    };
    return await this.getQuery(query);
  }

  private async getQuery(query) {
    try {
      // Create a query with SQL statement, and get query id
      const createQueryRes = await axios.post(this.DATA_ENDPOINT, query, {
        headers: this.HEADERS,
      });
      console.log(createQueryRes.data);

      const queryId = createQueryRes.data.id;
      const dataLakeSubmissionEndpoint = `https://api.zettablock.com/api/v1/queries/${queryId}/trigger`;

      // Trigger the query by query id, and get queryrun id
      const triggerQueryRes = await axios.post(
        dataLakeSubmissionEndpoint,
        {},
        { headers: this.HEADERS },
      );
      const queryRunId = triggerQueryRes.data.queryrunId;

      // Check status using queryrun id
      const getResponse = async (queryRunId) => {
        const queryRunStatusEndpoint = `https://api.zettablock.com/api/v1/queryruns/${queryRunId}/status`;

        let i = 1;
        while (true) {
          const statusRes = await axios.get(queryRunStatusEndpoint, {
            headers: this.HEADERS,
          });
          const state = statusRes.data.state;
          if (state === 'SUCCEEDED' || state === 'FAILED') {
            return state;
          }
          await new Promise((resolve) => setTimeout(resolve, i * 1000));
          i += 1;
        }
      };

      const state = await getResponse(queryRunId);

      if (state === 'SUCCEEDED') {
        // Fetch result from queryrun id
        const params = { includeColumnName: 'true' };
        const queryRunResultEndpoint = `https://api.zettablock.com/api/v1/stream/queryruns/${queryRunId}/result`;

        // If the result is huge, consider using stream and write to a file
        const resultRes = await axios.get(queryRunResultEndpoint, {
          headers: this.HEADERS,
          params,
        });

        console.log(resultRes.data);

        return resultRes.data;
      } else {
        console.log(state);
        console.error('Query failed, please check status message for details');
      }
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  private parseRankingData(data: string): any[] {
    const lines = data.trim().split('\n');
    return lines.map((line) => {
      const [id, transactionCount, startDate, endDate] = line.split(',');
      return {
        id,
        transactionCount: Number(transactionCount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
    });
  }

  private parseCoinAssetTrackingData(data: string): any[] {
    const lines = data.trim().split('\n');
    return lines.map((line) => {
      const [
        transaction_block_digest,
        checkpoint_sequence_number,
        checkpoint_digest,
        block_time,
        index,
        owner_type,
        owner_address,
        initial_shared_version,
        coin_type,
        amount,
        process_time,
      ] = line.split(',');
      return {
        transaction_block_digest,
        checkpoint_sequence_number,
        checkpoint_digest,
        block_time: new Date(block_time),
        index,
        owner_type,
        owner_address,
        initial_shared_version,
        coin_type,
        amount,
        process_time,
      };
    });
  }

  private parseNftAssetTrackingData(data: string): any[] {
    const lines = data.trim().split('\n');
    return lines.map((line) => {
      const [
        transaction_block_digest,
        checkpoint_sequence_number,
        block_time,
        sender,
        owner_type,
        owner_address,
        nft_collection_type,
        nft_object_id,
        nft_package_id,
        token_id,
        token_name,
        token_image_url,
        token_description,
        token_receiver,
        event_parsed_json,
        event_seq,
        event_transaction_module,
        event_type,
        event_bcs,
        object_change_digest,
        data_creation_date,
      ] = line.split(',');
      return {
        transaction_block_digest,
        checkpoint_sequence_number,
        block_time: new Date(block_time),
        sender,
        owner_type,
        owner_address,
        nft_collection_type,
        nft_object_id,
        nft_package_id,
        token_id,
        token_name,
        token_image_url,
        token_description,
        token_receiver,
        event_parsed_json,
        event_seq,
        event_transaction_module,
        event_type,
        event_bcs,
        object_change_digest,
        data_creation_date,
      };
    });
  }

  private parseEvent(data: string): any[] {
    const lines = data.trim().split('\n');
    return lines.map((line) => {
      const [
        transaction_block_digest,
        checkpoint_sequence_number,
        checkpoint_digest,
        event_seq,
        sender,
        package_id,
        transaction_module,
        type,
        bcs,
        parsed_json,
        block_time,
        process_time,
      ] = line.split(',');
      return {
        transaction_block_digest,
        checkpoint_sequence_number,
        checkpoint_digest,
        event_seq,
        sender,
        package_id,
        transaction_module,
        type,
        bcs,
        parsed_json,
        block_time: new Date(block_time),
        process_time,
      };
    });
  }

  private createRankingQuery(startDate, packageIds, eventType, page, pageSize) {
    // Package IDs를 SQL에 삽입할 수 있는 형식으로 변환
    const packageIdsCondition = packageIds
      .map((id) => `'${id}'`)
      .join(' or e.package_id = ');

    const eventTypeCondition = eventType
      ? `AND type like '%${eventType}%'`
      : '';

    return `
    SELECT
        sender as user,
        COUNT(distinct transaction_block_digest),
        MIN(block_time) as first_updated,
        MAX(block_time) as last_updated
    FROM sui_mainnet.events as e
    WHERE e.block_time >= DATE('${startDate}')
    AND (
        e.package_id = ${packageIdsCondition}
    )
    ${eventTypeCondition} 
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT ${pageSize}
  `;
  }

  private createCoinAssetTrackingQuery(
    startDate,
    walletAddress,
    coinType,
    page,
    pageSize,
  ) {
    // Package IDs를 SQL에 삽입할 수 있는 형식으로 변환

    return `
    SELECT
  transaction_block_digest,
  checkpoint_sequence_number,
  checkpoint_digest,
  block_time,
  index,
  owner_type,
  owner_address,
  initial_shared_version,
  coin_type,
  amount,
  process_time
FROM
  sui_mainnet.balance_changes
WHERE
  coin_type = '${coinType}'
  AND
    block_time >= DATE('${startDate}')
ORDER BY block_time DESC  
LIMIT ${pageSize}
  `;
  }
  private createNftAssetTrackingQuery(
    startDate,
    walletAddress,
    packageIds,
    page,
    pageSize,
  ) {
    console.log('API_KEY', this.API_KEY);
    console.log('API_KEY', this.HEADERS);
    // Package IDs를 SQL에 삽입할 수 있는 형식으로 변환
    const packageIdsCondition = packageIds
      .map((id) => `'${id}'`)
      .join(' or package_id = ');

    return `
    SELECT
  project_name,
  transaction_block_digest,
  checkpoint_sequence_number,
  block_time,
  event_seq,
  sender,
  package_id,
  transaction_module,
  seller,
  buyer,
  nft_collection_type,
  nft_item_id,
  price,
  amount_raw,
  ft_token_type,
  parsed_json,
  event_type,
  full_event_type,
  bcs,
  data_creation_date
FROM
  nft.sui_trades
WHERE
    block_time >= DATE('${startDate}')
  AND
  (
        package_id = ${packageIdsCondition}
    )
ORDER BY block_time DESC  
LIMIT ${pageSize}
  `;
  }

  private createEventQuery(
    startDate,
    walletAddress,
    packageIds,
    page,
    pageSize,
  ) {
    // Package IDs를 SQL에 삽입할 수 있는 형식으로 변환
    const packageIdsCondition = packageIds
      .map((id) => `'${id}'`)
      .join(' or package_id = ');

    return `
    SELECT
  transaction_block_digest,
  checkpoint_sequence_number,
  checkpoint_digest,
  event_seq,
  sender,
  package_id,
  transaction_module,
  type,
  bcs,
  parsed_json,
  block_time,
  process_time
FROM
  sui_mainnet.events
WHERE
    block_time >= DATE('${startDate}')
  AND
  (
        package_id = ${packageIdsCondition}
    )
ORDER BY block_time DESC
LIMIT ${pageSize}
  `;
  }

  private createGameTransactionCount(
    packageIds: string[],
    startDate?: string,
    walletAddress?: string,
  ): string {
    // Package IDs를 SQL에 삽입할 수 있는 형식으로 변환
    const packageIdsCondition = packageIds
      .map((id) => `'${id}'`)
      .join(' or package_id = ');

    let sqlQuery = `
    SELECT count(*)
    FROM sui_mainnet.events
    WHERE 1=1`; // 항상 참인 조건을 추가하여 WHERE 절을 시작합니다.

    if (startDate) {
      sqlQuery += ` AND block_time >= DATE('${startDate}')`;
    }

    sqlQuery += ` AND (
      package_id = ${packageIdsCondition}
  )`;

    if (walletAddress) {
      sqlQuery += ` AND sender = '${walletAddress}'`;
    }

    return sqlQuery;
  }
}
