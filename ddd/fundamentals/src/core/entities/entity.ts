import { UniqueEntityId } from "../../domain/entities/value-objects/unique-entity-id";

export class Entity<PropsType> {
	private _id: UniqueEntityId;
	protected props: PropsType;

	get id() {
		return this._id;
	}

	protected constructor(props: PropsType, id?: UniqueEntityId) {
		this._id = id ?? new UniqueEntityId(id);

		this.props = props;
	}
}
