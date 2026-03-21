import { UniqueEntityId } from "../../domain/entities/value-objects/unique-entity-id";

export class Entity<PropsType> {
	private _id: UniqueEntityId;
	protected props: PropsType;

	get id() {
		return this._id;
	}

	constructor(props: PropsType, id?: string) {
		this._id = new UniqueEntityId(id);

		this.props = props;
	}
}
