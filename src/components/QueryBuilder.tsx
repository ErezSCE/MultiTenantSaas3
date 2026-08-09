import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

export type QueryParams = {
  eventName: string;
  startDate: string; // ISO date string (yyyy-mm-dd)
  endDate: string;
  propertyKey?: string;
  propertyValue?: string;
  aggregation: 'count' | 'sum';
};

type QueryBuilderProps = {
  /**
   * Callback invoked when the user submits a query.
   * The component does not perform any network request itself –
   * the parent component decides how to handle the query.
   */
  onSubmit: (params: QueryParams) => void;
};

/**
 * Simple visual query builder used by the Query Results page.
 * It demonstrates the required UI elements without being overly complex.
 */
export const QueryBuilder: React.FC<QueryBuilderProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QueryParams>();

  const submitHandler: SubmitHandler<QueryParams> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
      {/* Event name selection */}
      <label>
        Event Name
        <select {...register('eventName', { required: true })} data-testid="eventName">
          <option value="">Select an event</option>
          <option value="login">Login</option>
          <option value="purchase">Purchase</option>
        </select>
      </label>
      {errors.eventName && <span style={{ color: 'red' }}>Event name is required</span>}

      {/* Time range */}
      <label>
        Start Date
        <input type="date" {...register('startDate', { required: true })} data-testid="startDate" />
      </label>
      {errors.startDate && <span style={{ color: 'red' }}>Start date is required</span>}

      <label>
        End Date
        <input type="date" {...register('endDate', { required: true })} data-testid="endDate" />
      </label>
      {errors.endDate && <span style={{ color: 'red' }}>End date is required</span>}

      {/* Property filter – optional */}
      <label>
        Property Key
        <input type="text" {...register('propertyKey')} placeholder="e.g. country" data-testid="propertyKey" />
      </label>

      <label>
        Property Value
        <input type="text" {...register('propertyValue')} placeholder="e.g. US" data-testid="propertyValue" />
      </label>

      {/* Aggregation type */}
      <label>
        Aggregation
        <select {...register('aggregation', { required: true })} data-testid="aggregation">
          <option value="">Select aggregation</option>
          <option value="count">Count</option>
          <option value="sum">Sum</option>
        </select>
      </label>
      {errors.aggregation && <span style={{ color: 'red' }}>Aggregation is required</span>}

      <button type="submit" data-testid="submitBtn">Run Query</button>
    </form>
  );
};
